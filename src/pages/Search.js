import React, { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import {useAppDispatch,useAppSelector} from "../hooks/useApp";
import { getHomePageVideos } from '../store/reducers/getHomePageVideos';
import Spinner from '../components/Spinner';
import InfiniteScroll from 'react-infinite-scroll-component';
import Card from '../components/Card';
import { useNavigate } from 'react-router-dom';
import { clearVideos } from '../features/youtube/youtubeSlice';
import { getSearchPageVideos } from '../store/reducers/getSearchPageVideos';
import SearchCard from '../components/SearchCard';

export default function Home() {

const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const videos = useAppSelector((state)=> state.youtubeApp.videos);
  const searchTerm = useAppSelector((state)=> state.youtubeApp.searchTerm);

  useEffect(()=>{
    dispatch(clearVideos());
    if(searchTerm==="")navigate("/");
    else(
        dispatch(getSearchPageVideos(false))
    )
  },[dispatch,navigate,searchTerm])


  return (
    <div className='max-h-screen overflow-hidden'>
      <div style={{height:"7.5vh"}}>
      <Navbar/>
      </div>
      <div className='flex' style={{height:"92.5vh"}}>
      <Sidebar/>
      {
        videos.length ? (
            <div className='py-8 pl-8 flex flex-col gap-5 w-full'>
          <InfiniteScroll 
          dataLength={videos.length} 
          next={()=> dispatch(getSearchPageVideos(true))}
          hasMore={videos.length < 500}
          loader={<Spinner/>}
          height={600}
          >
              
                {videos.map((item) => {
                  return (
                    <div className='my-5'>
                  <SearchCard data={item} key={item.videoId}/>
                  </div>
                  )
                })}
              
          </InfiniteScroll>
          </div>
        ):(
          <Spinner/>
        )
      }
      </div>
    </div>
  )
}
