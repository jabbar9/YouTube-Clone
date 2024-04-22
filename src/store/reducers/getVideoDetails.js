import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { convertRawtoString } from "../../utils/convertRawtoString";
import { timeSince } from "../../utils/timeSince";

const API_KEY = process.env.REACT_APP_YOUTUBE_DATA_API_KEY;

export const getVideoDetails = createAsyncThunk(
    "youtube/App/videoDetails",
    async(id) => {
        const {
            data:{items},
        } = await axios.get(`https://youtube.googleapis.com/youtube/v3/videos?key=${API_KEY}&part=snippet,statistics&type=video&id=${id}`);
        

        const parsedData = parseData(items[0]);
        console.log(parsedData)
        return parsedData;
        
    }
);

const parseData = async(item) =>{
const channelResponse = await axios.get(`https://youtube.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${item.snippet.channelId}&key=${API_KEY}`)
const snippet = item.snippet;
const id= item.id;
const statistics = item.statistics;

const channelImage = channelResponse.data.items[0].snippet.thumbnails.default.url;
const subscriberCount = channelResponse.data.items[0].statistics.subscriberCount;


return {
    videoId : id,
        videoTitle: snippet.title,
        videoDescription:snippet.description,
        videoViews:convertRawtoString(
          statistics.viewCount
        ),
        videoLikes:convertRawtoString(
          statistics.likeCount
        ),
        videoAge:timeSince(new Date(snippet.publishedAt)
        ),
        channelInfo:{
          id:snippet.channelId,
          image:channelImage,
          name:snippet.channelTitle,
          subscribers:convertRawtoString(subscriberCount,true),
}
}
}