package controllers

import (
	"net/http"
	"strconv"
	
	"github.com/gin-gonic/gin"
	"github.com/acd19ml/EventCOM/models"
	"github.com/acd19ml/EventCOM/services"
)

type TalkController struct {
	talkService services.TalkService
}

func NewTalkController(talkService services.TalkService) TalkController {
	return TalkController{talkService}
}

func (dc *TalkController) CreateTalk(ctx *gin.Context) {
	var talk models.CreateTalkRequest

	if err := ctx.ShouldBindJSON(&talk); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"status": "fail", "message": err.Error()})
		return
	}

	newTalk, err := dc.talkService.CreateTalk(&talk)
	if err != nil {
		ctx.JSON(http.StatusBadGateway, gin.H{"status": "fail", "message": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"status": "success", "data": newTalk})
}

func (dc *TalkController) UpdateTalk(ctx *gin.Context) {
	talkId := ctx.Param("talkId")

	var talk models.UpdateTalk
	if err := ctx.ShouldBindJSON(&talk); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"status": "fail", "message": err.Error()})
		return
	}

	updatedTalk, err := dc.talkService.UpdateTalk(talkId, &talk)
	if err != nil {
		ctx.JSON(http.StatusBadGateway, gin.H{"status": "fail", "message": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": "success", "data": updatedTalk})
}

func (dc *TalkController) FindTalkById(ctx *gin.Context) {
	talkId := ctx.Param("talkId")

	talk, err := dc.talkService.FindTalkById(talkId)
	if err != nil {
		ctx.JSON(http.StatusBadGateway, gin.H{"status": "fail", "message": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": "success", "data": talk})
}

func (dc *TalkController) FindTalks(ctx *gin.Context) {
	page, _ := strconv.Atoi(ctx.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(ctx.DefaultQuery("limit", "100"))

	talks, err := dc.talkService.FindTalks(page, limit)
	if err != nil {
		ctx.JSON(http.StatusBadGateway, gin.H{"status": "fail", "message": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": "success", "results": len(talks), "data": talks})
}

func (dc *TalkController) DeleteTalk(ctx *gin.Context) {
	talkId := ctx.Param("talkId")

	err := dc.talkService.DeleteTalk(talkId)
	if err != nil {
		ctx.JSON(http.StatusBadGateway, gin.H{"status": "fail", "message": err.Error()})
		return
	}

	ctx.JSON(http.StatusNoContent, nil)
}