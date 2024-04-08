package gapi

import (
	"context"
	"strings"
	"time"

	"github.com/acd19ml/EventCOM/models"
	"github.com/acd19ml/EventCOM/pb"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/timestamppb"
)

func (postServer *PostServer) UpdatePost(ctx context.Context, req *pb.UpdatePostRequest) (*pb.PostResponse, error) {
	postId := req.GetId()

	post := &models.UpdatePost{
		Email:    req.GetEmail(),
		Name:     req.GetName(),
		Role:     req.GetRole(),
		Organisation: req.GetOrganisation(),
		Contact: req.GetContact(),
		KindofTalk: req.GetKindofTalk(),
		Title:    req.GetTitle(),
		Description:  req.GetDescription(),
		Dates:    req.GetDates(),
		ExtraDetails: req.GetExtraDetails(),
		Location: req.GetLocation(),
		Status:   req.GetStatus(),
		UpdatedAt: time.Now(),
	}

	updatedPost, err := postServer.postService.UpdatePost(postId, post)

	if err != nil {
		if strings.Contains(err.Error(), "Id exists") {
			return nil, status.Errorf(codes.NotFound, err.Error())
		}
		return nil, status.Errorf(codes.Internal, err.Error())
	}

	res := &pb.PostResponse{
		Post: &pb.Post{
			Id:        updatedPost.Id.Hex(),
			Email:     updatedPost.Email,
			Name:      updatedPost.Name,
			Role:      updatedPost.Role,
			Organisation : updatedPost.Organisation,
			Contact:  updatedPost.Contact,
			KindofTalk: updatedPost.KindofTalk,
			Title:     updatedPost.Title,
			Description: updatedPost.Description,
			Dates:     updatedPost.Dates,
			ExtraDetails: updatedPost.ExtraDetails,
			Location:  updatedPost.Location,
			Status:    updatedPost.Status,
			CreatedAt: timestamppb.New(updatedPost.CreateAt),
			UpdatedAt: timestamppb.New(updatedPost.UpdatedAt),
		},
	}
	return res, nil
}
