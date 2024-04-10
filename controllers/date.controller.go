package controllers

import (
	"net/http"
	"strconv"
	
	"github.com/gin-gonic/gin"
	"github.com/acd19ml/EventCOM/models"
	"github.com/acd19ml/EventCOM/services"
)

type DateController struct {
	dateService services.DateService
}

func NewDateController(dateService services.DateService) DateController {
	return DateController{dateService}
}

func (dc *DateController) CreateDate(ctx *gin.Context) {
	var date models.CreateDateRequest

	if err := ctx.ShouldBindJSON(&date); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"status": "fail", "message": err.Error()})
		return
	}

	newDate, err := dc.dateService.CreateDate(&date)
	if err != nil {
		ctx.JSON(http.StatusBadGateway, gin.H{"status": "fail", "message": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"status": "success", "data": newDate})
}

func (dc *DateController) UpdateDate(ctx *gin.Context) {
	dateId := ctx.Param("dateId")

	var date models.UpdateDate
	if err := ctx.ShouldBindJSON(&date); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"status": "fail", "message": err.Error()})
		return
	}

	updatedDate, err := dc.dateService.UpdateDate(dateId, &date)
	if err != nil {
		ctx.JSON(http.StatusBadGateway, gin.H{"status": "fail", "message": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": "success", "data": updatedDate})
}

func (dc *DateController) FindDateById(ctx *gin.Context) {
	dateId := ctx.Param("dateId")

	date, err := dc.dateService.FindDateById(dateId)
	if err != nil {
		ctx.JSON(http.StatusBadGateway, gin.H{"status": "fail", "message": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": "success", "data": date})
}

func (dc *DateController) FindDates(ctx *gin.Context) {
	page, _ := strconv.Atoi(ctx.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(ctx.DefaultQuery("limit", "10"))

	dates, err := dc.dateService.FindDates(page, limit)
	if err != nil {
		ctx.JSON(http.StatusBadGateway, gin.H{"status": "fail", "message": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": "success", "results": len(dates), "data": dates})
}

func (dc *DateController) DeleteDate(ctx *gin.Context) {
	dateId := ctx.Param("dateId")

	err := dc.dateService.DeleteDate(dateId)
	if err != nil {
		ctx.JSON(http.StatusBadGateway, gin.H{"status": "fail", "message": err.Error()})
		return
	}

	ctx.JSON(http.StatusNoContent, nil)
}
