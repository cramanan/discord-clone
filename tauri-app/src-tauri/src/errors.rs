use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct AppError {
    message: String,
}

impl<T: ToString> From<T> for AppError {
    fn from(value: T) -> Self {
        Self {
            message: value.to_string(),
        }
    }
}
