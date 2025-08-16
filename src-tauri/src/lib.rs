mod commands;
mod exif_info;

use commands::parse_exif_info;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![parse_exif_info])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
