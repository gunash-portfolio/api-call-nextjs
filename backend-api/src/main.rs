use std::error::Error;

async fn fetch_rust_website()->Result<(), Box<dyn Error>>{
    let body = reqwest::get("https://www.rust-lang.org").await?.text().await?;
    println!("body = {}", body);
    Ok(())
}
#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    fetch_rust_website().await?;
    Ok(())
}