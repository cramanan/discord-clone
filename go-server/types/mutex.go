package types

import "sync"

type Mutex[T any] struct {
	sync.Mutex
	data T
}
