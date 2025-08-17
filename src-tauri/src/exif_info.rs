use exif::{Exif, In, Reader, Tag};
use serde::{Deserialize, Serialize};
use std::fs;

#[derive(Serialize, Deserialize)]
pub struct ExifInfo {
    camera_make: Option<String>,
    camera_model: Option<String>,
    lens_model: Option<String>,
    focal_length: Option<String>,
    exposure_time: Option<String>,
    f_number: Option<String>,
    iso: Option<String>,
    date_time: Option<String>,
    date_time_original: Option<String>,
}

impl ExifInfo {
    pub fn from_file_path(file_path: &str) -> Result<ExifInfo, String> {
        let file = fs::File::open(file_path).map_err(|e| format!("Failed to open file: {}", e))?;

        let exif = Reader::new()
            .read_from_container(&mut std::io::BufReader::new(file))
            .map_err(|e| format!("Failed to read EXIF data: {}", e))?;

        Ok(ExifInfo {
            camera_make: ExifInfo::get_field_display_value(&exif, Tag::Make),
            camera_model: ExifInfo::get_field_display_value(&exif, Tag::Model),
            lens_model: ExifInfo::get_field_display_value(&exif, Tag::LensModel),
            focal_length: ExifInfo::get_field_display_value(&exif, Tag::FocalLength),
            exposure_time: ExifInfo::get_field_display_value(&exif, Tag::ExposureTime),
            f_number: ExifInfo::get_field_display_value(&exif, Tag::FNumber),
            iso: ExifInfo::get_field_display_value(&exif, Tag::PhotographicSensitivity),
            date_time: ExifInfo::get_field_display_value(&exif, Tag::DateTime),
            date_time_original: ExifInfo::get_field_display_value(&exif, Tag::DateTimeOriginal),
        })
    }

    fn get_field_display_value(exif: &Exif, tag: Tag) -> Option<String> {
        if let Some(field) = exif.get_field(tag, In::PRIMARY) {
            Some(field.display_value().to_string())
        } else {
            None
        }
    }
}
