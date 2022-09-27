import MovieJson from '../data/movies.json';
import { Column, DataTable, Filter, Sort, Transform } from "./DataTable";

interface Movie {
    actors: Array<string>
    description: string
    director: string
    genre: Array<string>
    metascore: number
    rank: number
    rating: number
    revenue: number
    runtime: number
    title: string
    votes: number
    year: number
}

const MOVIES: Array<Movie> = MovieJson.map(movie => ({
    ...movie,
    metascore: parseInt(movie.metascore),
    rank: parseInt(movie.rank),
    rating: parseInt(movie.rating),
    revenue: movie.revenue ? parseInt(movie.revenue) : 0,
    runtime: parseInt(movie.runtime),
    votes: parseInt(movie.votes),
    year: parseInt(movie.year),
}));

const MOVIES_COLUMNS: Array<Column<Movie>> = [
    { accessor: 'title', name: 'Title' },
    { accessor: 'year', name: 'Year' },
    { accessor: 'runtime', name: 'Runtime' },
    { accessor: 'revenue', name: 'Revenue' },
    { accessor: 'rating', name: 'Rating' },
    { accessor: 'genre', name: 'Genres' },
]

const MOVIES_TRANSFORMATIONS: Array<Transform<Movie>> = [
    { accessor: 'rating', transform: transformRatingToString },
    { accessor: 'revenue', transform: transformRevenueToString },
    { accessor: 'runtime', transform: transformRuntimeToString },
    { accessor: 'genre', transform: transformGenreToString },
]

const MOVIES_FILTERS: Array<Filter<Movie>> = [
    { accessor: 'title', filter: filterByTitle, input: { type: 'text', placeholder: 'Filter by Title' } },
    { accessor: 'genre', filter: filterByGenre, input: { type: 'select', placeholder: 'Filter by Genre', options: getMoviesGenresOptions(MOVIES) } },
    { accessor: 'year', filter: filterByYear, input: { type: 'select', placeholder: 'Filter by year', options: getMoviesYearsOptions(MOVIES) } },
    { accessor: 'rating', filter: filterByRating, input: { type: 'select', placeholder: 'Above', options: getMoviesRatingsOptions() } }
];

const MOVIES_SORTING: Array<Sort<Movie>> = [
    { accessor: 'title', sort: sortString },
    { accessor: 'year', sort: sortNumber },
    { accessor: 'runtime', sort: sortNumber },
    { accessor: 'revenue', sort: sortNumber },
    { accessor: 'rating', sort: sortNumber },
]

function MoviesTable() {
    return DataTable<Movie>({
        DATA: MOVIES,
        COLUMNS: MOVIES_COLUMNS,
        TRANSFORMATIONS: MOVIES_TRANSFORMATIONS,
        FILTERS: MOVIES_FILTERS,
        SORTS: MOVIES_SORTING
    });
}

export { MoviesTable }

// Helper functions

function getMoviesGenresOptions(movies: Array<Movie>) {
    const set = new Set();
    movies.forEach(({genre}) => genre.forEach(t => set.add(t)));
    return ((Array.from(set).map(genre => ({ text: genre, value: genre }))) as Array<{text: string, value: string}>)
        .sort((a,b) => a.text.localeCompare(b.text));
        
}

function getMoviesYearsOptions(movies: Array<Movie>) {
    return Array.from(new Set(movies.map(({year}) => year))).map(year => ({ text: year.toString(), value: year.toString() }))
        .sort((a,b) => a.text.localeCompare(b.text));
}

function getMoviesRatingsOptions() {
    return Array.from(new Array(9), (_, i) => ({ text: (i+1).toString(), value: (i+1).toString() }));
}

function transformRatingToString(rating: number) {
    return `${rating}/10`;
}

function transformRevenueToString(revenue: number) {
    if (!revenue) {
        return ' --- ';
    }

    return `$${revenue} M`;
}

function transformRuntimeToString(runtime: number) {
    if (runtime < 60) {
        return `${runtime}m`;
    }

    const hours = Math.floor(runtime / 60);
    const minutes = Math.floor(runtime % 60);

    return `${hours}h ${minutes}m`;
}

function transformGenreToString(genres: Array<string>) {
    return genres.join(', ');
}

function filterByTitle(movie: Movie, typedTitle: string) {
    return movie.title.toLowerCase().includes(typedTitle.toLowerCase());
}

function filterByGenre(movie: Movie, selectedGenre: string) {
    return movie.genre.some((genre: string) => genre === selectedGenre);
}

function filterByYear(movie: Movie, selectedYear: string) {
    return movie.year.toString() === selectedYear;
}

function filterByRating(movie: Movie, minRating: string) {
    return movie.rating > parseInt(minRating);
}

function sortString(accessor: keyof Movie, direction: 'ASC' | 'DESC', a: Movie, b: Movie) {
    const multiplier = direction === 'ASC' ? 1 : -1;

    return multiplier * (a[accessor] as string).localeCompare(b[accessor] as string);
}

function sortNumber(accessor: keyof Movie, direction: 'ASC' | 'DESC', a: Movie, b: Movie) {
    const multiplier = direction === 'ASC' ? 1 : -1;

    return multiplier * ((a[accessor] as number) - (b[accessor] as number));
}
