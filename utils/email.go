package utils

import (
	"bytes"
	"crypto/tls"
	"log" 
	"html/template"

	"github.com/k3a/html2text"
	"github.com/acd19ml/EventCOM/config"
	"github.com/acd19ml/EventCOM/models"
	"gopkg.in/gomail.v2"
)

type EmailData struct {
	URL       string
	FirstName string
	Subject   string
}

type GroupEmailData struct {
    Subject string
    Content string  
    URL     string  
}


// 👇 Email template parser
func SendEmail(user *models.DBResponse, data *EmailData, temp *template.Template, templateName string) error {
	config, err := config.LoadConfig(".")

	if err != nil {
		log.Fatal("could not load config", err)
	}

	// Sender data.
	from := config.EmailFrom
	smtpPass := config.SMTPPass
	smtpUser := config.SMTPUser
	to := user.Email
	smtpHost := config.SMTPHost
	smtpPort := config.SMTPPort

	var body bytes.Buffer

	if err := temp.ExecuteTemplate(&body, templateName, &data); err != nil {
		log.Fatal("Could not execute template", err)
	}

	m := gomail.NewMessage()

	m.SetHeader("From", from)
	m.SetHeader("To", to)
	m.SetHeader("Subject", data.Subject)
	m.SetBody("text/html", body.String())
	m.AddAlternative("text/plain", html2text.HTML2Text(body.String()))

	d := gomail.NewDialer(smtpHost, smtpPort, smtpUser, smtpPass)
	d.TLSConfig = &tls.Config{InsecureSkipVerify: true}

	// Send Email
	if err := d.DialAndSend(m); err != nil {
		return err
	}
	return nil
}

func SendGroupEmail(recipients []string, emailData *GroupEmailData, templateFile string) error {
    cfg, err := config.LoadConfig(".")
    if err != nil {
        log.Printf("Error loading config: %v", err)
        return err
    }

    // 使用 template.ParseFiles 直接加载指定模板
    tmpl, err := template.ParseFiles(templateFile)
    if err != nil {
        log.Printf("Error loading email template: %v", err)
        return err
    }

    var body bytes.Buffer
    if err := tmpl.Execute(&body, emailData); err != nil {
        log.Printf("Could not execute email template: %v", err)
        return err
    }

    m := gomail.NewMessage()
    m.SetHeader("From", cfg.EmailFrom)
    m.SetHeader("Subject", emailData.Subject)
    m.SetBody("text/html", body.String())
    m.AddAlternative("text/plain", html2text.HTML2Text(body.String()))

    d := gomail.NewDialer(cfg.SMTPHost, cfg.SMTPPort, cfg.SMTPUser, cfg.SMTPPass)
    d.TLSConfig = &tls.Config{InsecureSkipVerify: true}

    for _, recipient := range recipients {
        m.SetHeader("To", recipient)
        if err := d.DialAndSend(m); err != nil {
            log.Printf("Failed to send email to %s: %v", recipient, err)
            continue
        }
    }

    return nil
}

