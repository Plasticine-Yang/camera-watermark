use std::fs;
use std::path::Path;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn process_file(file_path: String, content: String) -> Result<String, String> {
    println!("Processing file: {}", file_path);

    // 获取文件信息
    let path = Path::new(&file_path);
    let file_name = path
        .file_name()
        .and_then(|n| n.to_str())
        .unwrap_or("unknown");

    let file_size = content.len();

    // 这里可以添加文件处理逻辑
    // 例如：解析JSON、处理文本、验证格式等

    Ok(format!(
        "File '{}' processed successfully. Size: {} bytes, Content type: {}",
        file_name,
        file_size,
        if content.trim().starts_with('{') || content.trim().starts_with('[') {
            "JSON"
        } else if content.trim().starts_with('<') {
            "XML/HTML"
        } else {
            "Plain text"
        }
    ))
}

#[tauri::command]
fn process_image(file_path: String) -> Result<String, String> {
    println!("Processing image: {}", file_path);

    let path = Path::new(&file_path);
    let file_name = path
        .file_name()
        .and_then(|n| n.to_str())
        .unwrap_or("unknown");

    // 检查文件是否存在
    if !path.exists() {
        return Err("File not found".to_string());
    }

    // 获取文件元数据
    let metadata =
        fs::metadata(&file_path).map_err(|e| format!("Failed to read file metadata: {}", e))?;

    let file_size = metadata.len();

    // 这里可以添加图片处理逻辑
    // 例如：读取图片尺寸、添加水印、格式转换等

    Ok(format!(
        "Image '{}' processed successfully. Size: {} bytes",
        file_name, file_size
    ))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, process_file, process_image])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
