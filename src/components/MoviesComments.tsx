import classes from '../styles/MoviesComments.module.scss';
import { Movie } from './MoviesTable';
import { FiArrowLeft } from 'react-icons/fi';
import { FaPaperPlane } from 'react-icons/fa';

function MoviesComments(props: { movie: Movie, closeFn: Function}) {
    return <div className={classes.moviesComments}>
        <header>
            <button onClick={() => props.closeFn()}>
                <FiArrowLeft/>
            </button>

            <h1> {props.movie.title} Comments</h1>
        </header>
        
        <ul>
            { props.movie.actors.map(actor => <li>{ actor }</li>) }
        </ul>

        <footer>
            <input type="text" />
            <button>
                <FaPaperPlane/>
            </button>
        </footer>
    </div>;
}

export { MoviesComments }