# How to run the code ?
- Clone the repo
- Open the terminal and run `npm install` and then `npm run dev`

# Explanation of architecture
- The data comes from the `movies.json` file in the `data` folder.

- `MoviesTable` component concerns are:
    - Decide on how to process that data
        - What structure of it is relevant (COLUMNS)
        - How to show the data ? (TRANSFORMS)
        - What filters are relevant (FILTERS)
        - What sortings are relevant (SORTS)
            - Those informations are then passed to `DataTable` component
    - Use a `Dialog` to show `MoviesComments` on `DataTable` row click

- `DataTable` component concerns are:
    - Get the data and the COLUMNS, TRANSFORMS, FILTERS and SORTS and process everything in a dynamic data table which is implemented with abstraction, i.e, it is data agnostic, therefore can be used with different data, processing things accorindgly to its props.
    - Performance... one of the properties of it is a `CONFIG` with the boolean `SHOW_ALL_ITEMS`. If set to false, it'll care about performance, showing only chunks of data which are increased per scroll.

- `Dialog` compoenents concerns are:
    - Show a pop up and its child element

- `MoviesComments` concerns are:
    - Connect to the firestore database
    - Get the comments for a specific movie
    - Allow creation of new comments

# If you had more time, what would you like to improve?
- DB config files in .env files
- Caching the database return for a small period of time to avoid unecessary calls
- Smooth transitions between components
- UI tests

# FYI
- Firebase DB connection config was left on a file on purpose
- The reason is to allow the proper testing of the front-end application without having the need to set up a new firestore database
- `DataTable` component is abstract enough in order to make it a npm package in future :)