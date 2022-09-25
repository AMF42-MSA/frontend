// import axios from 'axios';


import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
// material
import { alpha, styled } from '@mui/material/styles';
import moment from 'moment';


// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Modal
} from '@mui/material';
// components
import { confirmAlert } from 'react-confirm-alert'
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../sections/@dashboard/user';
import Searchbar from '../layouts/dashboard/Searchbar';
import DashboardNavbar from '../layouts/dashboard/DashboardNavbar';
import { AuctionListToolbar, AuctionInputBox } from '../sections/@dashboard/auction';

// axios 대체 - 헤더에 JWT토큰 추가
import axiosApi from '../sections/axiosApi';



// import AuctionRegisterPopover from '../layouts/dashboard/AuctionRegisterPopover';


// mock
import USERLIST from '../_mock/user';
import User from './User';


// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'categoryName', label: '강의분류', alignRight: false },
  { id: 'title', label: '강의명', alignRight: false },
  { id: 'startAuctionDate', label: '경매시작일자', alignRight: false },
  { id: 'endAuctionDate', label: '경매종료일자', alignRight: false },
  { id: 'maxEnrollment', label: '수강인원(최소/최대)', alignRight: false },
  // { id: 'lectCost', label: '강의료', alignRight: false },
  { id: 'auctionStatus', label: '경매상태', alignRight: false },
  { id: 'auctionRegUserName', label: '등록자', alignRight: false },
  // { id: 'auctionRegUserId', label: '등록자ID', alignRight: false },
  { id: 'auctionRegUserEmail', label: '메일주소', alignRight: false },



  // { id: 'bidCnt', label: '입찰수', alignRight: false },
  // { id: 'lowPrice', label: '최저입찰가', alignRight: false },


  { id: '' },
];
const http = axiosApi("auctions");
// ----------------------------------------------------------------------
const user = JSON.parse(localStorage.getItem("user"));

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  console.log(array);
  if (query) {
    return filter(array, (auction) => auction.title.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}




// function getInfo(){
//   return info;
// }


// export function auctionTemp(){

//   {_handleCloseRegister()};
// }




export default function Auction() {

  const [openRegister, setOpenRegister] = useState(false);

  const handleOpenRegister = () => {
    if(selected.length === 0) {
      alertPopup('경매등록할 강의를 선택하여 주세요.');
      return;
    }
    setOpenRegister(true);
  };

  const handleCloseRegister = () => {
    setOpenRegister(false);
  };

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [info, setInfo] = useState([])



  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = info.map((n) => n.lectId);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };



  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };


  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - info.length) : 0;

  const filteredUsers = applySortFilter(info, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;


  const getAuctionStatusValue = (auctionStatus) => {
    switch (auctionStatus){
      case "AUCTION" : return "경매중"
      case "BEFORE_AUCTION" : return "경매시작전"
      case "AFTER_AUCTION" : return "경매종료"
      case "BID_SUCCESS" : return "경매완료"
      default : return "미등록"
    }


  }
  // 경매취소 확인창
  const confirmPopup = () => {
    console.log(selected);

    if(selected.length === 0) {
      alertPopup('취소할 경매내역을 선택하여 주세요.');
      return;
    }

    for(let i=0; i<selected.length; i+=1){
      for(let j = 0; j<info.length; j+=1){
        if(selected[i] === info[j].lectId){

          if(info[j].auctionStatus==='' || info[j].auctionStatus===null){
            alertPopup('경매가 등록되어 있지 않습니다.');
            return;
          }
          if(info[j].auctionRegUserId!==user.memberId){
            console.log(user);

            alertPopup('등록자가 아니면 취소 권한이 없습니다.');
            return;

          }
        }
      }
    }


    confirmAlert({
      title : '경매취소 확인',
      message : '경매취소를 계속 하시겠습니까?',
      buttons: [
        {
          label: '네',
          onClick: () => {
            auctionCancel();
          }
        },
        {
          label: '아니오',
        }
      ]
    })
  }
    // 경매등록 확인창
    const alertPopup = (inputMessage) => {
      if(inputMessage === 'BID_SUCCESS'){
        inputMessage = '경매 낙찰이 완료된 경매는 취소할 수가 없습니다.'
      }
      confirmAlert({
        title : '확인',
        message : inputMessage,
        buttons: [
          {
            label: '확인',
            onClick: () => searchAuctionList()

          }
        ]
      })
    }








  // const auctions = () => {

  //   const response = axios.get("http://localhost:8088/auctions");
  //   console.log(response.data);

  //  }


  // const headers = {};
  // const response = axios.get('http://localhost:8088/auctions', headers);
  // response = axios.get("http://localhost:8088/auctions");
  // console.log(response.data);
  // console.log(181818181818)


  // const response = await axios.get(this.BASE_URL + '/api/hello', data);
  // const myMethod = () => {
  //   axios.put(`http://localhost:8088/auctions/1/cancel`,
  //   {
  //     withCredentials: true // 쿠키 cors 통신 설정
  //   }).then(response => {
  //     console.log(response);
  //   })

  // }



  const auctionCancel = async () => {
    http({
      method: 'put',
      url: '/auctionCancel',
      data: {
        lectIds: selected, // selected에 lectId를 담고 있다.
        auctionRegUserId: user.memberId

      }
    })
    .then(res => alertPopup(res.data))
    .catch(err => console.log(err))
  }

  // const auctionCancel = () => {

  //   axios({
  //     method: 'put',
  //     url: 'http://localhost:8088/auctions/auctionCancel',
  //     data: {
  //       lectIds: selected, // selected에 lectId를 담고 있다.
  //       // id: '1'
  //     }
  //   })
  //   .then(res => alertPopup(res.data))
  //   .catch(err => console.log(err))
  // }



  // const searchAuctionList = () => {
  //   axios.get('http://localhost:8088/auctions/searchAuctionList')
  //   .then(res => setInfo(res.data))
  //   .catch(err => console.log(err));
  // }


  const searchAuctionList = async () => {
    http({
      method: 'get',
      url: '/searchAuctionList',
    })
    .then(res => setInfo(res.data))
    .catch(err => console.log(err));
  }

  // useEffect(() => {

  //   axios(

  //     {
  //       url: 'http://localhost:8088/auctions/searchAuctionList',
  //       method: "get"
  //     }
  //   )
    // .then(
    //   res => setInfo(res.data)
    // )
    // .catch(err => console.log(err));



  // }, [])


  useEffect(() => {

    http({
      method: 'get',
      url: '/searchAuctionList'
    })
    .then(
      res => setInfo(res.data),
      res => console.log(res.data)
    )
    .catch(err => console.log(err));



  }, [])

  // const onSubmit = async () => {
  //   http({
  //     method: 'post',
  //     url: '/login',
  //     data: {
  //       email: methods.getValues().inputEmail,
  //       pwd: methods.getValues().inputPassword,
  //     }
  //   })
  // }







  // console.log(info)


  const [modalVisible, setModalVisible] = useState(true)

  const closeModal = () => {
    setModalVisible(false)
  }

  const dateToString = (rawDate) => {

    if(rawDate !== null){
        return moment(rawDate).format('YYYY-MM-DD')
      }
  }


  const [open, setOpen] = useState(false);

  const searchAuction = () => {
  }

  return (




    <Page title="User">




      <Container>






        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            경매조회
          </Typography>

          <DashboardNavbar onOpenSidebar={() => setOpen(false)} />

{/*
          <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
          <AuctionRegisterPopover />
          </Stack> */}
          <div>
            <AuctionInputBox
              isOpenRegister={openRegister}
              onOpenRegister={handleOpenRegister}
              onCloseRegister={handleCloseRegister}
              onAfterSaveAuction={searchAuctionList}
              selectedLectinfo={info}
              selectedlectId={selected}
            />

            {" "}
            <Button variant="outlined" onClick={confirmPopup} component={RouterLink} to="#" startIcon={<Iconify icon="ic:outline-delete" />}>
              경매취소
            </Button>

          </div>

        </Stack>

        <Card>
          <AuctionListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 1000 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={info.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    // const { id, title, lectStatus,  startAuctionDate, endAuctionDate} = row;

                    const { lectId, categoryName, title, startAuctionDate,  endAuctionDate, maxEnrollment, minEnrollment, lectCost, auctionStatus, auctionRegUserName, auctionRegUserEmail} = row;


                    const isItemSelected = selected.indexOf(lectId) !== -1;

                    return (
                      <TableRow
                        hover
                        key={lectId}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, lectId)} />
                        </TableCell>

                        <TableCell align="left">{categoryName}</TableCell>


                        <TableCell align="left">{title}</TableCell>

                        {/* <TableCell align="left">{title}</TableCell> */}
                        <TableCell align="left">{dateToString(startAuctionDate)}</TableCell>
                        <TableCell align="left">{dateToString(endAuctionDate)}</TableCell>
                        <TableCell align="left">{minEnrollment} / {maxEnrollment}</TableCell>
                        {/* <TableCell align="left">{lectCost}</TableCell> */}
                        {/* <TableCell align="left">{auctionStatus}</TableCell> */}

                         <TableCell align="left">
                          <Label variant="ghost" color={((auctionStatus === 'AFTER_AUCTION' || auctionStatus === 'BEFORE_AUCTION'|| auctionStatus === 'BID_SUCCESS')&& 'error') || 'success'}>
                           {getAuctionStatusValue(auctionStatus)}
                          </Label>
                        </TableCell>
                        <TableCell align="left">{auctionRegUserName}</TableCell>
                        {/* <TableCell align="left">{auctionRegUserId}</TableCell> */}
                        <TableCell align="left">{auctionRegUserEmail}</TableCell>

                        {/* <TableCell align="left">{bidCnt}</TableCell>
                        <TableCell align="left">{lowPrice}</TableCell> */}


                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={info.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

    </Page>

  );

}


