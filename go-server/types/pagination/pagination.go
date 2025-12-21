package pagination

type Filters struct {
	Page    int `form:"page,default=1" json:"page"`
	PerPage int `form:"per-page,default=20" json:"perPage"`
}

type Page[T any] struct {
	Data  []T  `json:"data"`
	Total uint `json:"total"`
	Filters
}
