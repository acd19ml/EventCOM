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

// loadConfig loads configuration from the default location and returns a pointer to the config.
func loadConfig() (*config.Config, error) {
	cfg, err := config.LoadConfig(".")
	if err != nil {
		log.Printf("could not load config: %v", err)
		return nil, err
	}
	return &cfg, nil // Return the address of cfg to match the expected pointer return type.
}

// createEmailMessage prepares an email message from the provided parameters.
func createEmailMessage(from string, to []string, subject string, bodyHTML string, smtpUser string, smtpPass string) *gomail.Message {
	m := gomail.NewMessage()
	m.SetHeader("From", from)
	m.SetHeader("To", to...)
	m.SetHeader("Subject", subject)
	m.SetBody("text/html", bodyHTML)
	m.AddAlternative("text/plain", html2text.HTML2Text(bodyHTML))
	return m
}

// sendEmailMessage sends an email message using the provided SMTP server details.
func sendEmailMessage(m *gomail.Message, smtpHost string, smtpPort int, smtpUser string, smtpPass string) error {
	d := gomail.NewDialer(smtpHost, smtpPort, smtpUser, smtpPass)
	d.TLSConfig = &tls.Config{InsecureSkipVerify: true}
	if err := d.DialAndSend(m); err != nil {
		log.Printf("error sending email: %v", err)
		return err
	}
	return nil
}

// SendEmail sends an email to a single recipient using the specified template.
func SendEmail(user *models.DBResponse, data *EmailData, temp *template.Template, templateName string) error {
	cfg, err := loadConfig()
	if err != nil {
		return err
	}

	var body bytes.Buffer
	if err := temp.ExecuteTemplate(&body, templateName, data); err != nil {
		log.Printf("could not execute template: %v", err)
		return err
	}

	m := createEmailMessage(cfg.EmailFrom, []string{user.Email}, data.Subject, body.String(), cfg.SMTPUser, cfg.SMTPPass)
	return sendEmailMessage(m, cfg.SMTPHost, cfg.SMTPPort, cfg.SMTPUser, cfg.SMTPPass)
}

// SendGroupEmail sends an email to multiple recipients using the specified template file.
func SendGroupEmail(recipients []string, emailData *GroupEmailData, templateFile string) error {
	cfg, err := loadConfig()
	if err != nil {
		return err
	}

	tmpl, err := template.ParseFiles(templateFile)
	if err != nil {
		log.Printf("error loading email template: %v", err)
		return err
	}

	var body bytes.Buffer
	if err := tmpl.Execute(&body, emailData); err != nil {
		log.Printf("could not execute email template: %v", err)
		return err
	}

	m := createEmailMessage(cfg.EmailFrom, recipients, emailData.Subject, body.String(), cfg.SMTPUser, cfg.SMTPPass)
	return sendEmailMessage(m, cfg.SMTPHost, cfg.SMTPPort, cfg.SMTPUser, cfg.SMTPPass)
}


