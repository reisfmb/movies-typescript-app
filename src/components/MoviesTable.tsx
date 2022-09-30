import { useState } from 'react';
import classes from '../styles/MoviesTable.module.scss';
import MovieJson from '../data/movies.json';
import { Column, DataTable, Filter, Sort, SortDirection, Transform } from "./DataTable/DataTable";
import { Dialog } from './Dialog';
import { MoviesComments } from './MoviesComments';
import { ImStarFull, ImStarHalf, ImStarEmpty } from 'react-icons/im';
import { BiMovie, BiCalendarAlt } from 'react-icons/bi';
import { MdAttachMoney, MdOutlineKeyboardArrowUp, MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { TbClock, TbListSearch } from 'react-icons/tb';
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
    rating: parseFloat(movie.rating),
    revenue: movie.revenue ? parseInt(movie.revenue) : 0,
    runtime: parseInt(movie.runtime),
    votes: parseInt(movie.votes),
    year: parseInt(movie.year),
}));

const MOVIES_DATATABLE_CONFIG = {
    SHOW_ALL_ITEMS: false,
    ICONS: { ASC: <MdOutlineKeyboardArrowUp/>, DESC: <MdOutlineKeyboardArrowDown/> },
    NUM_ITEMS_TO_SHOW_INITTIALY: 20,
    NUM_ITEMS_TO_INCREASE_PER_SCROLL: 10,
    WRAPPER_DIV_CLASS: classes.movies__tableWrap,
}

const MOVIES_COLUMNS: Array<Column<Movie>> = [
    { accessor: 'title', view: <><BiMovie/> {'Title'}</> },
    { accessor: 'year', view: <><BiCalendarAlt/> {'Year'}</> },
    { accessor: 'runtime', view: <><TbClock/> {'Runtime'}</> },
    { accessor: 'revenue', view: <><MdAttachMoney/> {'Revenue'}</> },
    { accessor: 'rating', view: <><ImStarEmpty/> {'Rating'}</> },
    { accessor: 'genre', view: <><TbListSearch/> {'Genres'}</> },
];

const MOVIES_TRANSFORMATIONS: Array<Transform<Movie>> = [
    { accessor: 'rating', transform: transformRating },
    { accessor: 'revenue', transform: transformRevenue },
    { accessor: 'runtime', transform: transformRuntime },
    { accessor: 'genre', transform: transformGenre },
];

const MOVIES_FILTERS: Array<Filter<Movie>> = [
    { accessor: 'title', filter: filterByTitle, input: { type: 'text', placeholder: 'Filter by Title' } },
    { accessor: 'genre', filter: filterByGenre, input: { type: 'select', placeholder: 'Filter by Genre', options: getMoviesGenresOptions(MOVIES) } },
    { accessor: 'year', filter: filterByYear, input: { type: 'select', placeholder: 'Filter by year', options: getMoviesYearsOptions(MOVIES) } },
    { accessor: 'runtime', filter: filterByRuntime, input: { type: 'select', placeholder: 'Between', options: getMoviesRuntimeOptions(MOVIES) } },
    { accessor: 'revenue', filter: filterByRevenue, input: { type: 'select', placeholder: 'Between', options: getMoviesRevenueOptions(MOVIES) } },
    { accessor: 'rating', filter: filterByRating, input: { type: 'select', placeholder: 'Above', options: getMoviesRatingsOptions() } }
];

const MOVIES_SORTING: Array<Sort<Movie>> = [
    { accessor: 'title', sort: sortString },
    { accessor: 'year', sort: sortNumber },
    { accessor: 'runtime', sort: sortNumber },
    { accessor: 'revenue', sort: sortNumber },
    { accessor: 'rating', sort: sortNumber },
];

function MoviesTable() {
    const [ movieToInspect, setMovieToInspect ] = useState({} as Movie);
    const [ showDialog, setShowDialog ] = useState(false);

    function MOVIES_ON_ROW_CLICK(movie: Movie) {
        setMovieToInspect(movie);
        setShowDialog(true);
    }

    return <div className={classes.movies}>

        <Dialog show={showDialog}>
            <MoviesComments 
                movie={movieToInspect}
                closeFn={() => setShowDialog(false)} />
        </Dialog>

        {
            DataTable<Movie>({
                CONFIG: MOVIES_DATATABLE_CONFIG,
                DATA: MOVIES,
                COLUMNS: MOVIES_COLUMNS,
                TRANSFORMATIONS: MOVIES_TRANSFORMATIONS,
                FILTERS: MOVIES_FILTERS,
                SORTS: MOVIES_SORTING,
                onRowClick: MOVIES_ON_ROW_CLICK
            })
        }
    </div>
}

export { MoviesTable }

export type { Movie }

// Helper functions

// TRANSFORMS
function transformRating(rating: number) {
    const numberOfFullStars = Math.floor(rating / 2);
    const numberOfHalfStars = Math.floor(rating % 2);
    const numberOfEmptyStarts = 5 - (numberOfFullStars + numberOfHalfStars);

    const ratingText = `${rating}/10`;

    return <div title={ratingText}>
        { Array.from(new Array(numberOfFullStars), (_) => <ImStarFull />) }
        { Array.from(new Array(numberOfHalfStars), (_) => <ImStarHalf />) }
        { Array.from(new Array(numberOfEmptyStarts), (_) => <ImStarEmpty />) }
    </div>;
}

function transformRevenue(revenue: number) {
    const str = revenue ? `$${revenue} M` : ' --- ';
    return <>{str}</>;
}

function transformRuntime(runtime: number) {
    if (runtime < 60) {
        return <>{`${runtime}m`}</>;
    }

    const hours = Math.floor(runtime / 60);
    const minutes = Math.floor(runtime % 60);

    return <>{`${hours}h ${minutes}m`}</>;
}

function transformGenre(genres: Array<string>) {
    return <>{genres.join(', ')}</>;
}


// FILTERS
function filterByTitle(movie: Movie, typedTitle: string) {
    return movie.title.toLowerCase().includes(typedTitle.toLowerCase());
}

function filterByGenre(movie: Movie, selectedGenre: string) {
    return movie.genre.some((genre: string) => genre === selectedGenre);
}

function filterByYear(movie: Movie, selectedYear: string) {
    return movie.year.toString() === selectedYear;
}

function filterByRuntime(movie: Movie, selectedRange: `${string},${string}`) {
    const [min, max] = selectedRange.split(',').map(n => Number(n));
    return min <= movie.runtime && movie.runtime <= max;
}

function filterByRevenue(movie: Movie, selectedRange: `${string},${string}`) {
    const [min, max] = selectedRange.split(',').map(n => Number(n));
    return min <= movie.revenue && movie.revenue <= max;
}

function filterByRating(movie: Movie, minRating: string) {
    return movie.rating > parseInt(minRating);
}

// SORTS

// TODO: fix any typing
function sortString(accessor: string, direction: SortDirection, a: Movie, b: Movie) {
    const multiplier = direction === 'ASC' ? 1 : -1;
    return multiplier * ((a as any)[accessor] as string).localeCompare((b as any)[accessor] as string);
}

// TODO: fix any typing
function sortNumber(accessor: string, direction: SortDirection, a: Movie, b: Movie) {
    const multiplier = direction === 'ASC' ? 1 : -1;
    return multiplier * (((a as any)[accessor] as number) - ((b as any)[accessor] as number));
}

//

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

function getMoviesRuntimeOptions(movies: Array<Movie>) {
    return numericalOptionsRangeHelper(movies, 'runtime', 30).map(item => ({
        text: `${transformRuntime(item.min).props.children} to ${transformRuntime(item.max).props.children}`,
        value: `${item.min}, ${item.max}`,
    }));
}

function getMoviesRevenueOptions(movies: Array<Movie>) {
    return numericalOptionsRangeHelper(movies, 'revenue', 100).map(item => ({
        text: `${item.min} to ${item.max}`,
        value: `${item.min}, ${item.max}`,
    }));
}

function getMoviesRatingsOptions() {
    return Array.from(new Array(9), (_, i) => ({ text: (i+1).toString(), value: (i+1).toString() }));
}

function numericalOptionsRangeHelper(movies: Array<Movie>, key: keyof Movie, step: number) {
    const sortedMovies = movies.sort((a,b) => sortNumber(key, 'ASC', a, b));
    const min = sortedMovies[0][key];
    const max = sortedMovies[sortedMovies.length - 1][key];
    const numOfOptions = Math.ceil(Number(max) / step);

    return Array.from(new Array(numOfOptions), (_, i) => ({
        min: i * step,
        max: (i + 1) * step
    })).filter((option) => min <= option.max);
}