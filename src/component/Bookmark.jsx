import React from 'react'

const Bookmark = ({event, date}) => {

const formattedDate = new Date(date)

  return (
    <div className='bookmark'> Bookmark created: {formattedDate.toLocaleString('en-US')}, <br /> Link to Event: {<a href={"/events/"+event} target="_blank"> Event Link </a>} </div>
  )
}

export default Bookmark