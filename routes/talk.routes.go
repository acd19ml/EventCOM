package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/acd19ml/EventCOM/controllers"
)

type TalkRouteController struct {
	talkController controllers.TalkController
}

func NewTalkControllerRoute(talkController controllers.TalkController) TalkRouteController {
	return TalkRouteController{talkController}
}

func (r *TalkRouteController) TalkRoute(rg *gin.RouterGroup) {
	router := rg.Group("/talks")
	router.GET("/", r.talkController.FindTalks)
	router.GET("/:talkId", r.talkController.FindTalkById)
	router.POST("/", r.talkController.CreateTalk)
	router.PATCH("/:talkId", r.talkController.UpdateTalk)
	router.DELETE("/:talkId", r.talkController.DeleteTalk)
}