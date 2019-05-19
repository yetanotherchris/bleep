package server

import (
	"encoding/json"
	"fmt"
	"log"

	"github.com/bspaans/bleep/controller"
	"github.com/bspaans/bleep/sequencer/definitions"
	"github.com/gorilla/websocket"
)

type MessageType string

const (
	Test            MessageType = "test"
	Status          MessageType = "status"
	ChannelDef      MessageType = "channel_def"
	SequencerDef    MessageType = "sequencer_def"
	SetSequencerDef MessageType = "set_sequencer_def"
)

type ResponseMessage struct {
	Type MessageType `json:"type"`
	Data interface{} `json:"data"`
}

type StatusResponse struct {
	BPM float64
}

type Message struct {
	Type MessageType `json:"type"`
	Data string      `json:"data"`
}

func (m *Message) Handle(ctrl *controller.Controller, conn *websocket.Conn) {
	log.Println("handling", m.Type, "message")
	if m.Type == Test {
		m.send(conn, m.Type, "Test")
	}

	if ctrl.Sequencer == nil {
		log.Println("No sequencer.")
		return
	}
	if m.Type == Status {
		m.send(conn, m.Type, &StatusResponse{
			BPM: ctrl.Sequencer.Status.BPM,
		})
	} else if m.Type == ChannelDef {
		m.send(conn, m.Type, ctrl.Sequencer.InitialChannelSetup)
	} else if m.Type == SequencerDef {
		m.send(conn, m.Type, ctrl.Sequencer.SequencerDef.Sequences)
	} else if m.Type == SetSequencerDef {
		def := definitions.SequencerDef{}
		if err := json.Unmarshal([]byte(m.Data), &def); err != nil {
			fmt.Println("Invalid sequencer_def:", err.Error())
		}
		fmt.Println("Received sequencer def:")
		fmt.Println(def.YAML())
		ctrl.Sequencer.SetSequencerDef(&def)
	}
}

func (m *Message) send(conn *websocket.Conn, typ MessageType, v interface{}) {
	msg, err := json.Marshal(&ResponseMessage{
		Type: typ,
		Data: v,
	})
	if err == nil {
		conn.WriteMessage(websocket.TextMessage, msg)
	}
}
