import React from 'react'
import Bookmark from './Bookmark'

const Bookmarks = ({ events, dates }) => {
 
const newEvents = events.map((event, i) => {
    return [event._id, dates[i]]
})

return ( newEvents.map((e) => {
    return <Bookmark event={e[0]} date={e[1]} />
}) 
)

}

export default Bookmarks


