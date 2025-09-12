use std::error::Error;
use serde_json::Value;



async fn fetch_and_print_body(url: &str) -> Result<(), Box<dyn Error>> {
    let response = reqwest::get(url).await?;
    let body = response.text().await?;
    println!("Raw Response Body:\n{}", body);
    Ok(())
}
#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    fetch_and_print_body("https://theaxolotlapi.netlify.app").await?;
    Ok(())
}