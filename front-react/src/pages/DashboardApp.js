import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';


// sections
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
  AppAuctionStatics,
} from '../sections/@dashboard/app';

// axios 대체 - 헤더에 JWT토큰 추가
import axiosApi from '../sections/axiosApi';

// ----------------------------------------------------------------------
const http = axiosApi("auctions");
const httpInterestCategory = axiosApi("interestCategories")
const httpLecture = axiosApi("lecture")
const httpMember = axiosApi("members")

export default function DashboardApp() {
  const user = JSON.parse(localStorage.getItem("user"));

  const theme = useTheme();

  const [info, setInfo] = useState([])
  const [weekDay, setWeekDay] = useState([])
  const [auctionStatics, setAuctionStatics] = useState([])

  const [bidStatics, setBidStatics] = useState([])

  const [successStatics, setSuccessStatics] = useState([])
  const [todayAuctionCount, setTodayAuctionCount] = useState([])
  const [todaySuccessBidCount, setTodaySuccessBidCount] = useState([])

  const [top5InterestCategoryList, setTop5InterestCategoryList] = useState([])
  const [lectureCount, setLectureCount] = useState([])
  const [memberCount, setMemberCount] = useState([])



  const searchAuctionStatics = async () => {
    http({
      method: 'get',
      url: '/searchAuctionStatics',
    })
    .then(res => successSearchAuctionStatics(res.data))

    .catch(err => console.log(err));
  }

  const successSearchAuctionStatics = async (data) => {
    console.log(data);
    const tempWeekDay = [];
    for(let i = 0 ;i<data.length; i+=1){
      console.log(i);

      tempWeekDay[i] = data[i].regDate;
      // weekDay[i] = data[i].regDate;
      auctionStatics[i] = data[i].auctionCount;
      bidStatics[i] = data[i].bidCount;
      successStatics[i] = data[i].successCount;



    }
    // 오늘 데이터는 별도 세팅 필요
    setTodayAuctionCount(data[data.length-1].auctionCount);
    setTodaySuccessBidCount(data[data.length-1].successCount);
    setWeekDay(tempWeekDay);


    // console.log(data[i]);
  }

  const getTop5InterestCategories = async () => {
    httpInterestCategory({
      method: 'get',
      url: '/top5InterestCategories',
    })
    .then(res => setTop5InterestCategoryList(res.data))
    .catch(err => console.log(err));
}


const getLectureCount = async () => {

  httpLecture({
    method: 'get',
    url: '/lecturesubs/lectureCount',
  })
  .then(res => setLectureCount(res.data))
  .catch(err => console.log(err));
}

const getMemberTotalCount = async () => {
  httpMember({
    method: 'get',
    url: '/totalcount',
  })
  .then(res => setMemberCount(res.data))
  .catch(err => console.log(err));
}



  useEffect(() => {
    // 아래로 계속 호출~ 필요한  함수
    getLectureCount();
    searchAuctionStatics();
    getTop5InterestCategories();
    getMemberTotalCount();
    // 404 에러 발생해서 주석 <--
  }, [])


  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Typography variant="h5" sx={{ mb: 5 }}>
        안녕하세요? {user.name}님.
        </Typography>

        <Grid container spacing={3}>


          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="가입자수" total={memberCount} color="info" icon={'ic:baseline-group-add'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="오늘의 강좌수" total={lectureCount} color="error" icon={'ant-design:bug-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="오늘의 경매수" total={todayAuctionCount} color="warning" icon={'ic:baseline-gavel'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="오늘의 낙찰수" total={todaySuccessBidCount} icon={'ic:outline-sentiment-satisfied-alt'} />
          </Grid>


          <Grid item xs={12} md={6} lg={8}>
            <AppAuctionStatics
              title="금주 강의 경매 현황"
              subheader="경매/입찰/낙찰"
              chartLabels={weekDay}
              chartData={[
                {
                  name: '경매건수',
                  type: 'column',
                  fill: 'solid',
                  data: auctionStatics,
                },
                {
                  name: '입찰건수',
                  type: 'column',
                  fill: 'solid',
                  data: bidStatics,
                },
                {
                  name: '낙찰건수',
                  type: 'column',
                  fill: 'solid',
                  data: successStatics,
                },
              ]}
            />
          </Grid>

          {/* <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Website Visits"
              subheader="(+43%) than last year"
              chartLabels={[
                '01/01/2003',
                '02/01/2003',
                '03/01/2003',
                '04/01/2003',
                '05/01/2003',
                '06/01/2003',
                '07/01/2003',
                '08/01/2003',
                '09/01/2003',
                '10/01/2003',
                '11/01/2003',
              ]}
              chartData={[
                {
                  name: 'Team A',
                  type: 'column',
                  fill: 'solid',
                  data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                },
                {
                  name: 'Team B',
                  type: 'area',
                  fill: 'gradient',
                  data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                },
                {
                  name: 'Team C',
                  type: 'line',
                  fill: 'solid',
                  data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                },
              ]}
            />
          </Grid> */}

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="인기분야 TOP5"


              chartData={
                top5InterestCategoryList.map((item) => {
                  return { label: item.categoryName, value: item.categoryCnt };
                })
              }
              chartColors={[
                theme.palette.primary.main,
                theme.palette.chart.blue[0],
                theme.palette.chart.violet[0],
                theme.palette.chart.yellow[0],
              ]}
            />
          </Grid>

          {/* <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates
              title="Conversion Rates"
              subheader="(+43%) than last year"
              chartData={[
                { label: 'Italy', value: 400 },
                { label: 'Japan', value: 430 },
                { label: 'China', value: 448 },
                { label: 'Canada', value: 470 },
                { label: 'France', value: 540 },
                { label: 'Germany', value: 580 },
                { label: 'South Korea', value: 690 },
                { label: 'Netherlands', value: 1100 },
                { label: 'United States', value: 1200 },
                { label: 'United Kingdom', value: 1380 },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentSubject
              title="Current Subject"
              chartLabels={['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math']}
              chartData={[
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ]}
              chartColors={[...Array(6)].map(() => theme.palette.text.secondary)}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppNewsUpdate
              title="News Update"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: faker.name.jobTitle(),
                description: faker.name.jobTitle(),
                image: `/static/mock-images/covers/cover_${index + 1}.jpg`,
                postedAt: faker.date.recent(),
              }))}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline
              title="Order Timeline"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: [
                  '1983, orders, $4220',
                  '12 Invoices have been paid',
                  'Order #37745 from September',
                  'New order placed #XF-2356',
                  'New order placed #XF-2346',
                ][index],
                type: `order${index + 1}`,
                time: faker.date.past(),
              }))}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTrafficBySite
              title="Traffic by Site"
              list={[
                {
                  name: 'FaceBook',
                  value: 323234,
                  icon: <Iconify icon={'eva:facebook-fill'} color="#1877F2" width={32} height={32} />,
                },
                {
                  name: 'Google',
                  value: 341212,
                  icon: <Iconify icon={'eva:google-fill'} color="#DF3E30" width={32} height={32} />,
                },
                {
                  name: 'Linkedin',
                  value: 411213,
                  icon: <Iconify icon={'eva:linkedin-fill'} color="#006097" width={32} height={32} />,
                },
                {
                  name: 'Twitter',
                  value: 443232,
                  icon: <Iconify icon={'eva:twitter-fill'} color="#1C9CEA" width={32} height={32} />,
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppTasks
              title="Tasks"
              list={[
                { id: '1', label: 'Create FireStone Logo' },
                { id: '2', label: 'Add SCSS and JS files if required' },
                { id: '3', label: 'Stakeholder Meeting' },
                { id: '4', label: 'Scoping & Estimations' },
                { id: '5', label: 'Sprint Showcase' },
              ]}
            />
          </Grid> */}
        </Grid>
      </Container>
    </Page>
  );
}
