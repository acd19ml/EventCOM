package services

import "github.com/acd19ml/EventCOM/models"

type TalkService interface {
	CreateTalk(*models.CreateTalkRequest) (*models.DBTalk, error)
	UpdateTalk(string, *models.UpdateTalk) (*models.DBTalk, error)
	FindTalkById(string) (*models.DBTalk, error)
	FindTalks(page int, limit int) ([]*models.DBTalk, error)
	DeleteTalk(string) error
}