package pagination

type Page[T any] struct {
	Data  []T  `json:"data"`
	Total uint `json:"total"`
}
