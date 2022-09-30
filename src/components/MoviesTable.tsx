import { useState } from 'react';
import classes from '../styles/MoviesTable.module.scss';
import MovieJson from '../data/movies.json';
import { Column, DataTable, Filter, Sort, Transform } from "./DataTable/DataTable";
import { Dialog } from './Dialog';
import { MoviesComments } from './MoviesComments';
import { TRANSFORMS, FILTERS, SORTS, GET_OPTIONS } from '../helpers/Movie';
import { ImStarEmpty } from 'react-icons/im';
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
    { accessor: 'rating', transform: TRANSFORMS.transformRating },
    { accessor: 'revenue', transform: TRANSFORMS.transformRevenue },
    { accessor: 'runtime', transform: TRANSFORMS.transformRuntime },
    { accessor: 'genre', transform: TRANSFORMS.transformGenre },
];

const MOVIES_FILTERS: Array<Filter<Movie>> = [
    { accessor: 'title', filter: FILTERS.filterByTitle, input: { type: 'text', placeholder: 'Filter by Title' } },
    { accessor: 'genre', filter: FILTERS.filterByGenre, input: { type: 'select', placeholder: 'Filter by Genre', options: GET_OPTIONS.getMoviesGenresOptions(MOVIES) } },
    { accessor: 'year', filter: FILTERS.filterByYear, input: { type: 'select', placeholder: 'Filter by year', options: GET_OPTIONS.getMoviesYearsOptions(MOVIES) } },
    { accessor: 'runtime', filter: FILTERS.filterByRuntime, input: { type: 'select', placeholder: 'Between', options: GET_OPTIONS.getMoviesRuntimeOptions(MOVIES) } },
    { accessor: 'revenue', filter: FILTERS.filterByRevenue, input: { type: 'select', placeholder: 'Between', options: GET_OPTIONS.getMoviesRevenueOptions(MOVIES) } },
    { accessor: 'rating', filter: FILTERS.filterByRating, input: { type: 'select', placeholder: 'Above', options: GET_OPTIONS.getMoviesRatingsOptions() } }
];

const MOVIES_SORTING: Array<Sort<Movie>> = [
    { accessor: 'title', sort: SORTS.sortString },
    { accessor: 'year', sort: SORTS.sortNumber },
    { accessor: 'runtime', sort: SORTS.sortNumber },
    { accessor: 'revenue', sort: SORTS.sortNumber },
    { accessor: 'rating', sort: SORTS.sortNumber },
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
