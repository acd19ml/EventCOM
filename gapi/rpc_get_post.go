package gapi

import (
	"context"
	"strings"

	"github.com/wpcodevo/golang-mongodb/pb"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/timestamppb"
)

func (postServer *PostServer) GetPost(ctx context.Context, req *pb.PostRequest) (*pb.PostResponse, error) {
	postId := req.GetId()

	post, err := postServer.postService.FindPostById(postId)
	if err != nil {
		if strings.Contains(err.Error(), "Id exists") {
			return nil, status.Errorf(codes.NotFound, err.Error())

		}
		return nil, status.Errorf(codes.Internal, err.Error())
	}

	res := &pb.PostResponse{
		Post: &pb.Post{
			Id:        post.Id.Hex(),
			Email:     post.Email,
			Name:      post.Name,
			Role:      post.Role,
			Organisation : post.Organisation,
			Contact:  post.Contact,
			KindofTalk: post.KindofTalk,
			Title:     post.Title,
			Description: post.Description,
			Dates:     post.Dates,
			ExtraDetails: post.ExtraDetails,
			Location:  post.Location,
			Status:    post.Status,
			CreatedAt: timestamppb.New(post.CreateAt),
			UpdatedAt: timestamppb.New(post.UpdatedAt),
		},
	}
	return res, nil
}
