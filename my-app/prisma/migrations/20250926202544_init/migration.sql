-- CreateTable
CREATE TABLE "public"."movies" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "release_date" TIMESTAMP(3) NOT NULL,
    "imdb_rating" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "movies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "movies_title_key" ON "public"."movies"("title");

-- CreateIndex
CREATE UNIQUE INDEX "movies_release_date_key" ON "public"."movies"("release_date");

-- CreateIndex
CREATE UNIQUE INDEX "movies_imdb_rating_key" ON "public"."movies"("imdb_rating");
