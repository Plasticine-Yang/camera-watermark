use crate::exif_info::ExifInfo;
use std::path::Path;

#[tauri::command]
pub fn parse_exif_info(file_path: String) -> Result<String, String> {
    let path = Path::new(&file_path);

    if !path.exists() {
        return Err("File not found".to_string());
    }

    let exif_info = ExifInfo::from_file_path(&file_path)?;

    Ok(serde_json::to_string_pretty(&exif_info)
        .map_err(|e| format!("Failed to serialize EXIF info: {}", e))?)
}
