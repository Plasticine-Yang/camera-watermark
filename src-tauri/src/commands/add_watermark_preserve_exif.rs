use image::{
    codecs::jpeg::JpegEncoder, codecs::png::PngEncoder, guess_format, load_from_memory,
    ImageFormat, Rgba, RgbaImage,
};
use resvg::{tiny_skia, usvg};
use serde::{Deserialize, Serialize};
use std::fs;
use std::io::Cursor;
use tauri::command;

#[derive(Serialize, Deserialize)]
pub struct WatermarkRequest {
    pub file_path: String,
    pub text: String,
    pub color: [u8; 4],   // RGBA
    pub position: String, // "bottom-center", "top-left", etc.
    pub font_size: u32,
}

#[derive(Serialize, Deserialize)]
pub struct WatermarkResponse {
    pub data: Vec<u8>,
    pub format: String,
}

#[command]
pub async fn add_watermark_preserve_exif(
    request: WatermarkRequest,
) -> Result<WatermarkResponse, String> {
    let raw_data = fs::read(&request.file_path).map_err(|e| format!("Read file error: {}", e))?;

    let image_format =
        guess_format(&raw_data).map_err(|e| format!("Failed to guess image format: {}", e))?;

    let dynamic_image =
        load_from_memory(&raw_data).map_err(|e| format!("Failed to load image: {}", e))?;

    let mut img_buffer = dynamic_image.into_rgba8();

    // 绘制 SVG 水印，使用白色作为默认颜色，透明度 1.0
    draw_watermark_image(
        &mut img_buffer,
        "/home/plasticine/code/projects/camera-watermark/src-tauri/icons/sony_logo.svg",
        &request.position,
        Some([255, 255, 255, 255]), // 白色，完全不透明
    )?;

    // 计算水印位置并绘制文本水印
    // draw_watermark_text_simple(
    //     &mut img_buffer,
    //     &request.text,
    //     Rgba(request.color),
    //     &request.position,
    //     request.font_size,
    // );

    // 将处理后的图片编码回原始格式
    let mut output_data = Vec::new();
    {
        let mut cursor = Cursor::new(&mut output_data);

        match image_format {
            ImageFormat::Jpeg => {
                let quality = 100;
                let encoder = JpegEncoder::new_with_quality(&mut cursor, quality);
                img_buffer
                    .write_with_encoder(encoder)
                    .map_err(|e| format!("Failed to encode JPEG: {}", e))?;
            }
            ImageFormat::Png => {
                let encoder = PngEncoder::new(&mut cursor);
                img_buffer
                    .write_with_encoder(encoder)
                    .map_err(|e| format!("Failed to encode PNG: {}", e))?;
            }
            _ => {
                return Err("Unsupported image format".to_string());
            }
        }
    }

    let format_str = match image_format {
        ImageFormat::Jpeg => "jpeg",
        ImageFormat::Png => "png",
        _ => "unknown",
    };

    Ok(WatermarkResponse {
        data: output_data,
        format: format_str.to_string(),
    })
}

fn draw_watermark_image(
    img: &mut RgbaImage,
    logo_path: &str,
    position: &str,
    custom_color: Option<[u8; 4]>, // RGBA 颜色，None 表示使用原始颜色
) -> Result<(), String> {
    // 读取并解析 SVG
    let svg_data = fs::read_to_string(logo_path)
        .map_err(|e| format!("Failed to read SVG file: {}", e))?;

    // 应用自定义颜色
    let svg_text = if let Some(color) = custom_color {
        modify_svg_color(&svg_data, color)
    } else {
        svg_data
    };

    let options = usvg::Options::default();
    let tree = usvg::Tree::from_str(&svg_text, &options)
        .map_err(|e| format!("Failed to parse SVG: {}", e))?;

    // 计算合适的大小（保持宽高比）
    let (img_width, img_height) = img.dimensions();
    let max_width = img_width / 10;
    let max_height = img_height / 10;

    let size = tree.size();
    let svg_width = size.width() as f32;
    let svg_height = size.height() as f32;

    let scale = (max_width as f32 / svg_width)
        .min(max_height as f32 / svg_height)
        .min(1.0);

    let scaled_width = (svg_width * scale) as u32;
    let scaled_height = (svg_height * scale) as u32;

    // 渲染 SVG 到像素图
    let mut pixmap = tiny_skia::Pixmap::new(scaled_width, scaled_height)
        .ok_or("Failed to create pixmap")?;

    resvg::render(
        &tree,
        tiny_skia::Transform::from_scale(scale, scale),
        &mut pixmap.as_mut(),
    );

    let logo_rgba = RgbaImage::from_raw(scaled_width, scaled_height, pixmap.data().to_vec())
        .ok_or("Failed to create image from pixmap")?;

    let logo_width = logo_rgba.width();
    let logo_height = logo_rgba.height();

    // 计算位置 - 使用相对边距（图片高度的2.5%）
    let margin = ((img_height as f32 * 0.05) as u32).max(10);
    let (x, y) = match position {
        "top-left" => (margin, margin),
        "top-right" => (img_width - logo_width - margin, margin),
        "bottom-left" => (margin, img_height - logo_height - margin),
        "bottom-right" => (
            img_width - logo_width - margin,
            img_height - logo_height - margin,
        ),
        "bottom-center" => (
            img_width / 2 - logo_width / 2,
            img_height - logo_height - margin,
        ),
        "top-center" => (img_width / 2 - logo_width / 2, margin),
        "center" => (
            img_width / 2 - logo_width / 2,
            img_height / 2 - logo_height / 2,
        ),
        _ => (
            img_width - logo_width - margin,
            img_height - logo_height - margin,
        ),
    };

    // 绘制logo到图片上
    for dy in 0..logo_height {
        for dx in 0..logo_width {
            let img_x = x + dx;
            let img_y = y + dy;

            if img_x < img_width && img_y < img_height {
                let logo_pixel = logo_rgba.get_pixel(dx, dy);
                let img_pixel = img.get_pixel_mut(img_x, img_y);

                // Alpha混合 - 使用完全不透明（透明度1.0）
                let logo_alpha = logo_pixel[3] as f32 / 255.0;

                for i in 0..3 {
                    img_pixel[i] = (logo_pixel[i] as f32 * logo_alpha
                        + img_pixel[i] as f32 * (1.0 - logo_alpha))
                        as u8;
                }
                // 保持背景alpha不变
            }
        }
    }

    Ok(())
}

fn modify_svg_color(svg_text: &str, color: [u8; 4]) -> String {
    let color_hex = format!("#{:02x}{:02x}{:02x}", color[0], color[1], color[2]);
    
    // 简单的字符串替换，将SVG中的颜色属性替换为指定颜色
    let mut result = svg_text.to_string();
    
    // 替换 fill 属性
    result = result.replace("fill=\"#000000\"", &format!("fill=\"{}\"", color_hex));
    result = result.replace("fill=\"black\"", &format!("fill=\"{}\"", color_hex));
    result = result.replace("fill=\"rgb(0,0,0)\"", &format!("fill=\"{}\"", color_hex));
    
    // 替换 stroke 属性
    result = result.replace("stroke=\"#000000\"", &format!("stroke=\"{}\"", color_hex));
    result = result.replace("stroke=\"black\"", &format!("stroke=\"{}\"", color_hex));
    result = result.replace("stroke=\"rgb(0,0,0)\"", &format!("stroke=\"{}\"", color_hex));
    
    // 如果SVG中没有指定颜色，添加默认的fill属性
    if !result.contains("fill=\"") {
        // 找到第一个 > 符号前添加 fill 属性
        if let Some(pos) = result.find('>') {
            if pos > 0 && !result[..pos].contains("fill") {
                // 在标签内添加 fill 属性
                if let Some(last_space) = result[..pos].rfind(' ') {
                    result.insert_str(last_space + 1, &format!(" fill=\"{}\"", color_hex));
                } else {
                    // 如果没有属性，直接添加
                    result.insert_str(pos, &format!(" fill=\"{}\"", color_hex));
                }
            }
        }
    }
    
    result
}

fn draw_watermark_text_simple(
    img: &mut RgbaImage,
    text: &str,
    color: Rgba<u8>,
    position: &str,
    font_size: u32,
) {
    let (width, height) = img.dimensions();
    let text_width = (text.len() as u32 * font_size * 3 / 5).min(width / 2);
    let text_height = font_size;
    let margin = 20;

    let (x, y) = match position {
        "top-left" => (margin, text_height + margin),
        "top-right" => (width - text_width - margin, text_height + margin),
        "bottom-left" => (margin, height - margin),
        "bottom-right" => (width - text_width - margin, height - margin),
        "bottom-center" => (width / 2 - text_width / 2, height - margin),
        "top-center" => (width / 2 - text_width / 2, text_height + margin),
        "center" => (width / 2 - text_width / 2, height / 2 + text_height / 2),
        _ => (width / 2 - text_width / 2, height - margin),
    };

    // 简单的文字绘制 - 使用像素块
    let char_width = (font_size as f32 * 0.5) as u32;
    let char_height = font_size;
    let mut current_x = x;

    for _ch in text.chars() {
        if current_x + char_width > width {
            break;
        }

        // 绘制字符背景
        for dy in 0..char_height {
            for dx in 0..char_width {
                let px = current_x + dx;
                let py = y - char_height + dy;
                if px < width && py < height {
                    let alpha = color[3] as f32 / 255.0;
                    let pixel = img.get_pixel_mut(px, py);

                    // 简单的alpha混合
                    pixel[0] = (color[0] as f32 * alpha + pixel[0] as f32 * (1.0 - alpha)) as u8;
                    pixel[1] = (color[1] as f32 * alpha + pixel[1] as f32 * (1.0 - alpha)) as u8;
                    pixel[2] = (color[2] as f32 * alpha + pixel[2] as f32 * (1.0 - alpha)) as u8;
                    pixel[3] = 255; // 不透明
                }
            }
        }

        current_x += char_width + 2;
    }
}
