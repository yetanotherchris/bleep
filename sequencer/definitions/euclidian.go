package definitions

import (
	. "github.com/bspaans/bleep/sequencer/sequences"
	"github.com/bspaans/bleep/util"
)

type EuclidianDef struct {
	Pulses   int
	Over     int
	Duration interface{}
	Sequence *SequenceDef
}

func (e *EuclidianDef) GetSequence(granularity int) (Sequence, error) {
	s, err := e.Sequence.GetSequence(granularity)
	if err != nil {
		return nil, util.WrapError("euclidian", err)
	}
	duration, err := parseDuration(e.Duration, granularity)
	if err != nil {
		return nil, util.WrapError("euclidian", err)
	}
	return EuclidianRhythm(e.Pulses, e.Over, duration, s), nil
}