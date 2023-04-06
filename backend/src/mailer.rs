use dotenvy::var;
use lettre::message::header::ContentType;
use lettre::message::Mailbox;
use lettre::transport::smtp::authentication::Credentials;
use lettre::{AsyncSmtpTransport, AsyncTransport, Message, Tokio1Executor};

#[derive(Debug, Clone)]
pub struct LettreMailer {
    mailer: AsyncSmtpTransport<Tokio1Executor>,
    default_from: String,
}

impl LettreMailer {
    pub async fn new() -> Self {
        let smtp_host = var("SMTP_HOST").expect("SMTP_HOST must be provided in the .env file");

        let creds = Credentials::new(
            var("SMTP_USERNAME").expect("SMTP_USERNAME must be provided in the .env file"),
            var("SMTP_PASSWORD").expect("SMTP_PASSWORD must be provided in the .env file"),
        );

        let mailer = AsyncSmtpTransport::<Tokio1Executor>::relay(&smtp_host)
            .unwrap()
            // .pool_config(PoolConfig::new().max_size(20))
            .credentials(creds)
            .build();

        // ping smtp mailer server
        // println!(
        //     ">>> MAILER connection status: {:?}",
        //     mailer
        //         .test_connection()
        //         .await
        //         .map_err(|err| err.to_string()),
        // );

        LettreMailer {
            mailer,
            default_from: var("DEFAULT_SENDER")
                .expect("DEFAULT_SENDER must be provided in the .env file"),
        }
    }

    pub async fn send_mail(
        &self,
        to: String,
        subject: String,
        message: String,
    ) -> Result<(), String> {
        let mailbox_from: Mailbox = format!("Polynotes <{}>", self.default_from)
            .parse()
            .unwrap();

        let message = Message::builder()
            .from(mailbox_from)
            .to(to.parse().unwrap())
            .subject(subject)
            .header(ContentType::TEXT_HTML)
            .body(format!("<body>{}</body>", message))
            .unwrap();

        match self.mailer.send(message).await {
            Ok(_) => Ok(()),
            Err(_) => Err("Error sending the mail".to_owned()),
        }
    }
}
