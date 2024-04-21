package controllers

import (
	"net/http"
	"strconv"
	"strings"

	// "fmt"
	"github.com/gin-gonic/gin"
	"github.com/acd19ml/EventCOM/models"
	"github.com/acd19ml/EventCOM/services"

	"github.com/acd19ml/EventCOM/utils"

	// "go.mongodb.org/mongo-driver/bson/primitive"
)
// const predefinedUserID = "66128277945dc259684b2111"	
type PostController struct {
	postService services.PostService
}

func NewPostController(postService services.PostService) PostController {
	return PostController{postService}
}

func (pc *PostController) CreatePost(ctx *gin.Context) {
	var post models.CreatePostRequest

	if err := ctx.ShouldBindJSON(&post); err != nil {
		ctx.JSON(http.StatusBadRequest, err.Error())
		return
	}
	
	

	post.SetDefaultStatus()
	// Initialize Todos with default values if empty
    if (post.Todos == models.Todo{}) { // Check if Todos is its zero value
        post.Todos = models.Todo{
            TitleProposed:  false,
            ContactSpeaker: false,
            TimeConfirmed:  false,
            VenueBooked:    false,
            WebUpdated:     false,
            CalenderInvite: false,
        }
    }

	// userID, err := primitive.ObjectIDFromHex(predefinedUserID)
    // if err != nil {
    //     ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid userID"})
    //     return
    // }
    // post.UserID = userID

	newPost, err := pc.postService.CreatePost(&post)

	if err != nil {
		if strings.Contains(err.Error(), "title already exists") {
			ctx.JSON(http.StatusConflict, gin.H{"status": "fail", "message": err.Error()})
			return
		}

		ctx.JSON(http.StatusBadGateway, gin.H{"status": "fail", "message": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"status": "success", "data": newPost})
}

func (pc *PostController) UpdatePost(ctx *gin.Context) {
	postId := ctx.Param("postId")

	var post *models.UpdatePost
	if err := ctx.ShouldBindJSON(&post); err != nil {
		ctx.JSON(http.StatusBadGateway, gin.H{"status": "fail", "message": err.Error()})
		return
	}

	updatedPost, err := pc.postService.UpdatePost(postId, post)
	if err != nil {
		if strings.Contains(err.Error(), "Id exists") {
			ctx.JSON(http.StatusNotFound, gin.H{"status": "fail", "message": err.Error()})
			return
		}
		ctx.JSON(http.StatusBadGateway, gin.H{"status": "fail", "message": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": "success", "data": updatedPost})
}

func (pc *PostController) FindPostById(ctx *gin.Context) {
	postId := ctx.Param("postId")

	post, err := pc.postService.FindPostById(postId)

	if err != nil {
		ctx.JSON(http.StatusBadGateway, gin.H{"status": "fail", "message": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": "success", "data": post})
}

func (pc *PostController) FindPosts(ctx *gin.Context) {
    var page = ctx.DefaultQuery("page", "1")
    var limit = ctx.DefaultQuery("limit", "1000")

	// userID, exists := ctx.Get("userID")
    // if !exists {
	// 	fmt.Println("UserID not found in context")
    //     ctx.JSON(http.StatusUnauthorized, gin.H{"error": "user not authenticated"})
    //     return
    // }

    // objUserID := userID.(primitive.ObjectID)  // 获取当前登录用户的 ObjectID

    intPage, err := strconv.Atoi(page)
    if err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"status": "fail", "message": "invalid page number"})
        return
    }

    intLimit, err := strconv.Atoi(limit)
    if err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"status": "fail", "message": "invalid limit value"})
        return
    }

    // 从服务层获取帖子，使用预定义的用户ID进行过滤
    // posts, err := pc.postService.FindPosts(objUserID, intPage, intLimit)
    posts, err := pc.postService.FindPosts(intPage, intLimit)
    if err != nil {
        ctx.JSON(http.StatusBadGateway, gin.H{"status": "fail", "message": err.Error()})
        return
    }

    ctx.JSON(http.StatusOK, gin.H{"status": "success", "results": len(posts), "data": posts})
}

func (pc *PostController) DeletePost(ctx *gin.Context) {
	postId := ctx.Param("postId")

	err := pc.postService.DeletePost(postId)

	if err != nil {
		if strings.Contains(err.Error(), "Id exists") {
			ctx.JSON(http.StatusNotFound, gin.H{"status": "fail", "message": err.Error()})
			return
		}
		ctx.JSON(http.StatusBadGateway, gin.H{"status": "fail", "message": err.Error()})
		return
	}

	ctx.JSON(http.StatusNoContent, nil)
}

func (pc *PostController) UpdateTodos(ctx *gin.Context) {
    postId := ctx.Param("postId")

    var todo models.Todo
    if err := ctx.ShouldBindJSON(&todo); err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"status": "fail", "message": "Invalid request body"})
        return
    }

    err := pc.postService.UpdateTodos(postId, todo)
    if err != nil {
        ctx.JSON(http.StatusBadGateway, gin.H{"status": "fail", "message": err.Error()})
        return
    }

    ctx.JSON(http.StatusOK, gin.H{"status": "success", "message": "Todos updated successfully"})
}

func (pc *PostController) SendEmailToGroup(ctx *gin.Context) {
    var req *models.EmailSendRequest
    if err := ctx.ShouldBindJSON(&req); err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
        return
    }

    // 创建邮件数据结构
    emailData := &utils.GroupEmailData{
        Subject: req.Subject,
        Content: req.Content,
        URL:     req.URL,
    }

    // 调用邮件发送函数
    if err := utils.SendGroupEmail(req.Recipients, emailData, "templates/groupEmail.html"); err != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send email"})
        return
    }

    ctx.JSON(http.StatusOK, gin.H{"message": "Emails sent successfully"})
}