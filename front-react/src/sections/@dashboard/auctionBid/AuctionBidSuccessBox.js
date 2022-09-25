import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import Calendar from 'react-calendar';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { filter } from 'lodash';



// material
import {
  Box,
  Radio,
  Stack,
  Button,
  Drawer,
  Rating,
  Divider,
  Checkbox,
  FormGroup,
  IconButton,
  Typography,
  RadioGroup,
  FormControlLabel,
  InputAdornment,
  TextField,
  Container,
  Card,
  TableRow,
  TableBody,
  TableCell,
  Table,
  TableContainer,
  TablePagination,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Page from '../../../components/Page';
import Label from '../../../components/Label';
import SearchNotFound from '../../../components/SearchNotFound';




// components
import Iconify from '../../../components/Iconify';
import Scrollbar from '../../../components/Scrollbar';
import { ColorManyPicker } from '../../../components/color-utils';
import { RHFTextField } from '../../../components/hook-form';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../user';


// mock
import USERLIST from '../../../_mock/user';


// axios 대체 - 헤더에 JWT토큰 추가
import axiosApi from '../../axiosApi';


// ----------------------------------------------------------------------

const http = axiosApi("lectureBids");
const user = JSON.parse(localStorage.getItem("user"));



export const SORT_BY_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'priceDesc', label: 'Price: High-Low' },
  { value: 'priceAsc', label: 'Price: Low-High' },
];
export const FILTER_GENDER_OPTIONS = ['Men', 'Women', 'Kids'];
export const FILTER_CATEGORY_OPTIONS = ['All', 'Shose', 'Apparel', 'Accessories'];
export const FILTER_RATING_OPTIONS = ['up4Star', 'up3Star', 'up2Star', 'up1Star'];
export const FILTER_PRICE_OPTIONS = [
  { value: 'below', label: 'Below $25' },
  { value: 'between', label: 'Between $25 - $75' },
  { value: 'above', label: 'Above $75' },
];
export const FILTER_COLOR_OPTIONS = [
  '#00AB55',
  '#000000',
  '#FFFFFF',
  '#FFC0CB',
  '#FF4842',
  '#1890FF',
  '#94D82D',
  '#FFC107',
];

// ----------------------------------------------------------------------

AuctionBidSuccessBox.propTypes = {
  isOpenBidSuccessRegister: PropTypes.bool,
  onOpenBidSuccessRegister: PropTypes.func,
  onCloseBidSuccessRegister: PropTypes.func,
};


function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.lectureBidId.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}


function getComparator(order, orderBy) {
return order === 'desc'
  ? (a, b) => descendingComparator(a, b, orderBy)
  : (a, b) => -descendingComparator(a, b, orderBy);
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

const TABLE_HEAD = [

  { id: 'bidRegUserName', label: '회원명', alignRight: false },
  { id: 'bidRegUserId', label: '회원 이메일', alignRight: false },

  { id: 'price', label: '입찰가', alignRight: false },
  { id: 'status', label: '상태', alignRight: false },




  { id: '' },
];

export default function AuctionBidSuccessBox({ isOpenBidSuccessRegister, onOpenBidSuccessRegister, onCloseBidSuccessRegister, onAfterSaveAuction, selectedLectinfo, bidDetailInfo, selectedAuctionId, successBidFlag , initBidCheck}) {

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [selected, setSelected] = useState([]);
  const [saveSelected, setSaveSelected] = useState([]);

  const [filterName, setFilterName] = useState('');
  const [auctionId, setAuctionId] = useState([]);
  const [info, setInfo] = useState([]);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - bidDetailInfo.length) : 0;
  const filteredUsers = applySortFilter(bidDetailInfo, getComparator(order, orderBy), filterName);
  const isUserNotFound = filteredUsers.length === 0;


  // console.log(159);
  // useEffect(() => {
  //   setSelected([]);
  //   console.log(18);
  // },[]);
  if(initBidCheck===false){
    selected.length =0;
  }


  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = bidDetailInfo.map((n) => n.lectureBidId);
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


  // const onBidSuccessButtonClick = (event, auctionId) => {

  //   searchBidDetailList(auctionId);

  // }

  // const searchBidDetailList = (auctionId) => {
  //   alert(13);
  //   axios(

  //     {
  //       url: "http://localhost:8084/lectureBids/searchLectureBidList/",
  //       method: "get",
  //       params: {"auctionId": 1}
  //     }
  //   )
  //   .then(
  //     res => console.log(res),
  //     setAuctionId(auctionId),
  //     handleOpenBidSuccessRegister()
  //   )
  //   .catch(err => console.log(err));

  // }

  // 낙찰팝업 OPEN/CLOSE
  //  const [openBidSuccessRegister, setOpenBidSuccessRegister] = useState(false);

  //  const handleOpenBidSuccessRegister = () => {
  //   alert(0);
  //    setOpenBidSuccessRegister(true);
  //  };

  // const handleCloseBidSuccessRegister = () => {
  //   setOpenBidSuccessRegister(false);
  // };





  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [bidPrice, setBidPrice] = useState(0);
  const confirmPopup = () => {
    console.log(selected);
    for(let i =0; i<selected.length; i+=1){
      console.log(selected[i]);
      saveSelected[i]=selected[i];
      // setSaveSelected(selected[i]);
    }
    setSaveSelected(selected);
    onCloseBidSuccessRegister();
    console.log(saveSelected);
    if(saveSelected.length === 0) {
      alertPopup('낙찰할 입찰내역을 선택해주세요.', 'fail');

      return;
    }

    if(saveSelected.length > 1) {
      alertPopup('1건만 선택하여 낙찰을 진행해주세요.', 'fail');
      return;
    }

    confirmAlert({
      title : '낙찰확인',
      message : '낙찰을 계속 진행 하시겠습니까?',
      buttons: [
        {
          label: '네',
          onClick: () => {
            successLectureBid();
          }
        },
        {
          label: '아니오',
        }
      ]
    })
  }

  // 경매등록 확인창
  const alertPopup = (inputMessage, flag) => {
    if(inputMessage === 'BID_SUCCESS'){
      inputMessage = '낙찰이 이미 진행되었습니다.'
    }

    if(flag==='fail'){
      confirmAlert({
        title : '확인',
        message : inputMessage,
        buttons: [
          {
            label: '확인',
            onClick: () => onOpenBidSuccessRegister()

          }
        ]
      })

    }else{
      confirmAlert({
        title : '확인',
        message : inputMessage,
        buttons: [
          {
            label: '확인',
            onClick: () => onAfterSaveAuction()

          }
        ]
      })
    }



  }

  const successLectureBid = async () => {

    console.log(selectedAuctionId);
    console.log(saveSelected[0]);

    http({
      method: 'put',
      url: '/successLectureBid',
      data: {
        id: saveSelected[0],
        auctionId: selectedAuctionId,
        bidSuccessReqUserId: user.memberId
      }
    })
    .then(res => alertPopup(res.data))
    .catch(err => console.log(err))
  }

  const getBidStatusValue = (bidStatus) => {
    switch (bidStatus){
      case "SUCCESS" : return "낙찰"
      case "FAIL" : return "유찰"
      default : return "입찰중"
    }


  }

  return (
    <>

    <Drawer
        id="auctionBidDrawer"
        anchor="right"
        open={isOpenBidSuccessRegister}
        onClose={onCloseBidSuccessRegister}
        PaperProps={{
          sx: { width: 800, border: 'none', overflow: 'hidden' },
        }}
      >

    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1, py: 2 }}>
      <Typography variant="subtitle1" sx={{ ml: 1 }}>
        입찰내역 조회
      </Typography>
      <IconButton onClick={onCloseBidSuccessRegister}>
        <Iconify icon="eva:close-fill" width={20} height={20} />
      </IconButton>
    </Stack>

    <Divider />


      <Card>
        {/* <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} /> */}

        <Scrollbar>
          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <UserListHead
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={bidDetailInfo.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
              />
              <TableBody>
                {bidDetailInfo.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                  // const { id, title, lectStatus,  startAuctionDate, endAuctionDate} = row;

                  const { lectureBidId, bidRegUserId, bidRegUserEmail, bidRegUserName, price, status} = row;


                  const isItemSelected = selected.indexOf(lectureBidId) !== -1;

                  return (
                    <TableRow
                      hover
                      key={lectureBidId}
                      tabIndex={-1}
                      role="checkbox"
                      selected={isItemSelected}
                      aria-checked={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, lectureBidId)} />
                      </TableCell>

                      {/* <TableCell align="left">{lectureBidId}</TableCell> */}
                      {/* <TableCell align="left">{bidRegUserId} </TableCell> */}
                      <TableCell align="left">{bidRegUserName}</TableCell>
                      <TableCell align="left">{bidRegUserEmail}</TableCell>
                      <TableCell align="left">{price}</TableCell>
                      <TableCell align="left">
                          <Label variant="ghost" color={((status === 'FAIL')&& 'error') || 'success'}>
                             {getBidStatusValue(status)}
                          </Label>
                      </TableCell>
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
          <Stack spacing={3} sx={{ p: 5 }}>

          <div>
            {successBidFlag && <Button variant="contained" onClick={confirmPopup} component={RouterLink} to="#" startIcon={<Iconify icon="ic:baseline-gavel" />}>
                낙찰요청
            </Button>}

          </div>
          </Stack>

        </Scrollbar>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={bidDetailInfo.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
</Drawer>
</>
  );
}
