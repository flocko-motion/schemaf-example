package main

import (
	"context"
	"log"

	"github.com/flocko-motion/schemaf/schemaf"

	"schemaf.local/schemaf-example/app"
)

func main() {
	a := schemaf.New(context.Background())
	app.Wire(a)
	if err := a.Run(); err != nil {
		log.Fatal(err)
	}
}
