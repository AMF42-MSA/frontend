import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
// material
import { alpha, styled } from '@mui/material/styles';
import { confirmAlert } from 'react-confirm-alert';
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
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../sections/@dashboard/user';
import { AuctionBidInputBox, AuctionBidSuccessBox, AuctionBidListToolbar } from '../sections/@dashboard/auctionBid';

// axios 대체 - 헤더에 JWT토큰 추가
import axiosApi from '../sections/axiosApi';



// mock
import USERLIST from '../_mock/user';


// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'categoryName', label: '강의분류', alignRight: false },
  { id: 'title', label: '강의명', alignRight: false },
  { id: 'startAuctionDate', label: '경매시작일자', alignRight: false },
  { id: 'endAuctionDate', label: '경매종료일자', alignRight: false },
  { id: 'maxEnrollment', label: '수강인원(최소/최대)', alignRight: false },
  // { id: 'lectCost', label: '강의료', alignRight: false },
  { id: 'auctionStatus', label: '경매상태', alignRight: false },
  { id: 'lectureBidCnt', label: '입찰수', alignRight: false },
  { id: 'bidMinPrice', label: '최저입찰가', alignRight: false },
  { id: 'bidDetailList', label: '입찰상세', alignRight: false },
  { id: 'bidSuccessBtn', label: '낙찰요청', alignRight: false },




  { id: '' },
];

const http = axiosApi("lectureBids");
const httpAuction = axiosApi("auctions");
const user = JSON.parse(localStorage.getItem("user"));

// ----------------------------------------------------------------------

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
  if (query) {
    return filter(array, (auctionBid) => auctionBid.title.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}



export default function User() {

  const [openRegister, setOpenRegister] = useState(false);

  const handleOpenRegister = () => {
    if(selected.length === 0) {
      alertPopup('입찰할 경매내역을 선택하여 주세요.');
      return;
    }
    setOpenRegister(true);
  };

  const handleCloseRegister = () => {
    setOpenRegister(false);
  };

  // 경매등록 확인창
  const alertPopup = (inputMessage) => {
    if(inputMessage==='BID_SUCCESS'){
      inputMessage = '경매 낙찰이 완료된 건은 취소할 수가 없습니다.'
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

  const getAuctionStatusValue = (auctionStatus) => {
    switch (auctionStatus){
      case "AUCTION" : return "경매중"
      case "BEFORE_AUCTION" : return "경매시작전"
      case "AFTER_AUCTION" : return "경매종료"
      case "BID_SUCCESS" : return "경매완료"
      default : return "미등록"
    }


  }



  // 낙찰팝업 OPEN/CLOSE
  const [openBidSuccessRegister, setOpenBidSuccessRegister] = useState(false);

  const handleOpenBidSuccessRegister = () => {
    setInitBidCheck(true);

    setOpenBidSuccessRegister(true);
  };

  const handleCloseBidSuccessRegister = () => {
    setInitBidCheck(false);
    setOpenBidSuccessRegister(false);
  };



  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [auctionId, setAuctionId] = useState([]);

  const [clickedAuctionId, setClickedAuctionId] = useState([]);



  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [info, setInfo] = useState([])

  const [detailInfo, setDetailInfo] = useState([])

  const [successBidFlag, setSuccessBidFlag] = useState(false);
  const [initBidCheck, setInitBidCheck] = useState(false);




  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };


  const onBidDetailButtonClick = (event, auctionId, auctionStatus) => {
    setSuccessBidFlag(false);
    searchBidDetailList(auctionId);
    // alert(1);
    // AuctionBidSuccessBox.setSelected([]);
    // AuctionBidSuccessBox.setSelected();
    console.log(AuctionBidSuccessBox.selected);
  }


  const onBidSuccessButtonClick = (event, auctionId, auctionStatus) => {
    if(auctionStatus === 'BID_SUCCESS'){
      alertPopup('경매 낙찰이 완료된 건입니다.');
      return;
    }
    if(auctionStatus === 'AFTER_AUCTION'){
      alertPopup('경매가 이미 종료 되었습니다.');
      return;
    }
    if(auctionStatus === 'BEFORE_AUCTION'){
      alertPopup('경매가 아직 시작되지 않았습니다.');
      return;
    }
    setSuccessBidFlag(true);

    searchBidDetailList(auctionId);

}

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = info.map((n) => n.auctionId);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(info, getComparator(order, orderBy), filterName);


  const confirmLectureBidCancel = () => {

    if(selected.length === 0) {
      alertPopup('입찰취소할 경매내역을 선택하여 주세요.');
      return;
    }

    for(let i=0; i<selected.length; i+=1){
      for(let j = 0; j<info.length; j+=1){
        if(selected[i] === info[j].auctionId){
          if(info[j].auctionStatus==='BID_SUCCESS'){
            alertPopup('경매 낙찰이 완료된 건은 취소할 수가 없습니다.');
            return;
          }
        }
      }
    }

    confirmAlert({
      title : '입찰취소',
      message : '입찰을 취소하시겠습니까?',
      buttons: [
        {
          label: '네',
          onClick: () => {
            lectureBidCancel();
          }
        },
        {
          label: '아니오',
        }
      ]
    })
  }

  // const auctions = () => {

  //   const response = axios.get("http://localhost:8084/auctions");
  //   console.log(response.data);

  //  }


  // const headers = {};
  // const response = axios.get('http://localhost:8084/auctions', headers);
  // response = axios.get("http://localhost:8084/auctions");
  // console.log(response.data);
  // console.log(181818181818)


  // const response = await axios.get(this.BASE_URL + '/api/hello', data);
  // const myMethod = () => {
  //   axios.put(`http://localhost:8084/auctions/1/cancel`,
  //   {
  //     withCredentials: true // 쿠키 cors 통신 설정
  //   }).then(response => {
  //     console.log(response);
  //   })

  // }



  const lectureBidCancel = async () => {
    console.log(selected);

    http({
      method: 'put',
      url: '/cancelBid',
      data: {
        auctionIds: selected,
        bidRegUserId: user.memberId
      }
    })
    .then(res => alertPopup(res.data))
    .catch(err => console.log(err))
  }

  const searchBidDetailList = async (auctionId) => {
    http(
      {
        url: "/searchLectureBidList",
        method: "get",
        params: {"auctionId": auctionId}
      }
    )
    .then(
      res => setDetailInfo(res.data),
      // console.log(5555),
      // console.log(detailInfo),
      setClickedAuctionId(auctionId),
      setInitBidCheck(true),
      handleOpenBidSuccessRegister()
    )
    .catch(err => console.log(err));

  }

  const searchAuctionList = async () => {
    httpAuction.get(`/searchAuctionLectureBidList`,{})
    .then(res => setInfo(res.data))
    .catch(err => console.log(err))
  }


  useEffect(() => {
    httpAuction.get('/searchAuctionLectureBidList')
    .then(res => setInfo(res.data))
    .catch(err => console.log(err));
  }, [])


  const auctionBidCancel= () => {
    console.log(info);
    http({
      method: 'put',
      url: '/cancelBid',
      data: {
        memberId: 1004,
        auctionId: 1
      }
    })
    .catch(err => console.log(err))
  }

  const isUserNotFound = filteredUsers.length === 0;

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



  return (
    <Page title="User">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            경매입찰 리스트
          </Typography>

{/*
          <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
          <AuctionRegisterPopover />
          </Stack> */}
          <div>
          <AuctionBidInputBox
              isOpenRegister={openRegister}
              onOpenRegister={handleOpenRegister}
              onCloseRegister={handleCloseRegister}
              onAfterSaveAuction={searchAuctionList}
              selectedLectinfo={info}
              selectedAuctionId={selected}
            />

          <AuctionBidSuccessBox
            isOpenBidSuccessRegister={openBidSuccessRegister}
            onOpenBidSuccessRegister={handleOpenBidSuccessRegister}
            onCloseBidSuccessRegister={handleCloseBidSuccessRegister}
            onAfterSaveAuction={searchAuctionList}
            selectedLectinfo={info}
            bidDetailInfo={detailInfo}
            selectedAuctionId={clickedAuctionId}
            successBidFlag={successBidFlag}
            initBidCheck={initBidCheck}
          />

          {" "}
          <Button variant="outlined" onClick={confirmLectureBidCancel} component={RouterLink} to="#" startIcon={<Iconify icon="ic:outline-delete" />}>
          입찰취소
              </Button>

          </div>

        </Stack>

        <Card>
          <AuctionBidListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

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

                    const { auctionId, lectId, categoryName, title, startAuctionDate,  endAuctionDate, maxEnrollment, minEnrollment, lectCost, auctionStatus, lectureBidCnt, bidMinPrice} = row;


                    const isItemSelected = selected.indexOf(auctionId) !== -1;

                    return (
                      <TableRow
                        hover
                        key={auctionId}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, auctionId)} />
                        </TableCell>

                        <TableCell align="left">{categoryName}</TableCell>
                        <TableCell align="left">{title} </TableCell>
                        <TableCell align="left">{dateToString(startAuctionDate)}</TableCell>
                        <TableCell align="left">{moment(endAuctionDate).format('YYYY-MM-DD')}</TableCell>
                        <TableCell align="left">{minEnrollment} / {maxEnrollment}</TableCell>
                        <TableCell align="right">{lectCost}</TableCell>
                        {/* <TableCell align="left">{auctionStatus}</TableCell> */}

                         <TableCell align="left">
                         <Label variant="ghost" color={((auctionStatus === 'AFTER_AUCTION' || auctionStatus === 'BEFORE_AUCTION' || auctionStatus === 'BID_SUCCESS')&& 'error') || 'success'}>
                           {getAuctionStatusValue(auctionStatus)}
                          </Label>
                        </TableCell>

                        <TableCell align="right">{lectureBidCnt}</TableCell>
                        <TableCell align="right">{bidMinPrice}</TableCell>
                        <TableCell align="left"><Button onClick={(event) => onBidDetailButtonClick(event, auctionId, auctionStatus)}  startIcon={<Iconify icon="ic:baseline-dvr"/>}/></TableCell>
                        <TableCell align="left"><Button onClick={(event) => onBidSuccessButtonClick(event, auctionId, auctionStatus)}  startIcon={<Iconify icon="ic:baseline-gavel" />}/></TableCell>







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
