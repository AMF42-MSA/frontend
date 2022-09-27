// import axios from 'axios';
import { useEffect, useState } from 'react';
import { confirmAlert } from 'react-confirm-alert'
import { filter } from 'lodash';

// material
import {
  Paper,
  Card,
  Table,
  Stack,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';
import { styled } from '@mui/material/styles';

// components
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';

// sections
import { CategoryListHead, CategoryListToolbar } from '../sections/@dashboard/lecturecategory';
// axios 대체 - 헤더에 JWT토큰 추가 ( import 할때 위치를 아래에 두어야 할 경우가 있습니다.)
import axiosApi from '../sections/axiosApi';


import account from '../_mock/account';


// -------------------------------------------------------------------


// 서비스 호출 context url 설정
const httpInterestCategory = axiosApi("interestCategories");
const httpLectureCategory = axiosApi("lectureCategories");

const INTERESTCATEGORY_TABLE_HEAD = [
  { id: 'categoryVO.categoryId', label: '분류ID', align: 'center' },
  { id: 'categoryVO.categoryName', label: '관심분류명', align: 'left' },
  { id: 'deletebtn' }
];
const CATEGORY_TABLE_HEAD = [
  { id: 'categoryId', label: '분류ID', align: 'center' },
  { id: 'categoryName', label: '분류명', align: 'left' },
  { id: 'addbtn' }
];
// ------------------------------------------------------------------

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
}));

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
    return filter(array, (_category) => _category.categoryName.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

function applySortInterestFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_category) => _category.categoryVO.categoryName.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}


export default function LectureCategory() {


  const [interestPage, setInterestPage] = useState(0);
  const [interestOrder, setInterestOrder] = useState('asc');
  const [interestOrderBy, setInterestOrderBy] = useState('categoryVO.categoryName');
  const [interestFilterValue, setInterestFilterValue] = useState('');
  const [interestRowsPerPage, setInterestRowsPerPage] = useState(5);
  const [INTERESTCATEGORYLIST, setINTERESTCATEGORYLIST] = useState([]);

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('categoryName');
  const [filterValue, setFilterValue] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [CATEGORYLIST, setCATEGORYLIST] = useState([]);

  const handleRequestInterestSort = (event, property) => {
    // console.log(property);
    const isAsc = interestOrderBy === property && interestOrder === 'asc';
    setInterestOrder(isAsc ? 'desc' : 'asc');
    setInterestOrderBy(property);
  };
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangeInterestPage = (event, newPage) => {
    setInterestPage(newPage);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeInterestRowsPerPage = (event) => {
    setInterestRowsPerPage(parseInt(event.target.value, 10));
    setInterestPage(0);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleInterestFilterByValue = (event) => {
    setInterestFilterValue(event.target.value);
  };
  const handleFilterByValue = (event) => {
    setFilterValue(event.target.value);
  };

  const filteredInterestCategories = applySortInterestFilter(INTERESTCATEGORYLIST, getComparator(interestOrder, interestOrderBy), interestFilterValue);
  const filteredCategories = applySortFilter(CATEGORYLIST, getComparator(order, orderBy), filterValue);

   // 관심분류 조회
   useEffect(() => {
    httpInterestCategory({
      method: 'post',
      url: '/searchByUser',
      data: {
        email: account.email
      }
    })
    .then(
      res => setINTERESTCATEGORYLIST(res.data)
    )
    .catch(err => console.log(err));
  }, []);

  // 전체 카테고리 조회
  useEffect(() => {
    httpLectureCategory({
      method: 'get',
      url: '/searchAll'
    })
    .then(
      res => setCATEGORYLIST(res.data)
    )
    .catch(err => console.log(err));
  }, []);

  const searchInterestCategoryList = async () => {
    httpInterestCategory({
      method: 'post',
      url: '/searchByUser',
      data: {
        email: account.email
      }
    })
    .then(
      res => setINTERESTCATEGORYLIST(res.data)
    )
    .catch(err => console.log(err));
  }

  const alertPopup = (inputMessage) => {
    confirmAlert({
      title : '확인',
      message : inputMessage,
      buttons: [
        {
          label: '확인',
          onClick: () => searchInterestCategoryList()
        }
      ]
    })
  }

  // ---------- modal창 관련 ------------ //

  // 삭제 확인창
  const confirmDeletePopup = (selectedId, selectedCategoryId, selectedCategoryName) => {
    confirmAlert({
      title : '관심분류 해제 확인',
      message : `선택하신 관심분류(${selectedCategoryName})를 해제하시겠습니까?`,
      buttons: [
        {
          label: '네',
          onClick: () => {
            requestDelete(selectedId, selectedCategoryId);
          }
        },
        {
          label: '아니오',
        }
      ]
    })
  }

  // 추가 확인창
  const confirmAddPopup = (selectedCategoryId, selectedCategoryName) => {
    confirmAlert({
      title : '관심분류 추가 확인',
      message : `선택하신 분류(${selectedCategoryName})를 관심분류로 추가하시겠습니까?`,
      buttons: [
        {
          label: '네',
          onClick: () => {
            requestAddInterestCategory(selectedCategoryId, selectedCategoryName);
          }
        },
        {
          label: '아니오',
        }
      ]
    })
  }
  // ---------- modal 창 관련 ------------ //


  const requestDelete = (selectedId, selectedCategoryId) => {
    httpInterestCategory({
      method: 'delete',
      url: '/delete',
      data: {
        Id: selectedId,
        email: account.email,
        categoryId: selectedCategoryId
      }
    })
    .then(res =>{
      const result = res.data;
      if(result === -1) {
        alertPopup('해당 관심분류가 존재하지 않습니다.');
      } else {
        alertPopup('관심분류 해제되었습니다.');
      }
    })
    .catch(err => console.log(err));
  };

  const requestAddInterestCategory = (selectedCategoryId, selectedCategoryName) => {
    // console.log(selectedCategoryId);
    httpInterestCategory({
      method: 'post',
      url: '/registerInterestCategory',
      data: {
        memberId: account.memberId,
        memberName: account.displayName,
        email: account.email,
        categoryId: selectedCategoryId,
        categoryName: selectedCategoryName
      }
    })
    .then(res =>{
      const result = res.data;
      if(result === -1) {
        alertPopup('이미 관심분류로 등록되어 있습니다.');
      } else {
        alertPopup('관심분류에 추가되었습니다.');
      }
    })
    .catch(err => console.log(err));
  };


  return (
    <Page title="Interest Category">
      <Container>
        <Stack direction="row" spacing={2} >

            <Item style={{width:'49%'}}>
              <Typography variant="h4" gutterBottom>
                관심 분류
              </Typography>

              <Scrollbar>
                <CategoryListToolbar filterValue={interestFilterValue} onFilterValue={handleInterestFilterByValue} />

                <TableContainer width="60%" margin="auto">
                  <Table>
                    <colgroup>
                      <col width="20%" />
                      <col width="70%" />
                      <col width="10%" />
                    </colgroup>

                    <CategoryListHead
                      order={interestOrder}
                      orderBy={interestOrderBy}
                      rowCount={INTERESTCATEGORYLIST.length}
                      headLabel={INTERESTCATEGORY_TABLE_HEAD}
                      onRequestSort={handleRequestInterestSort}
                    />

                    <TableBody>
                      {filteredInterestCategories.slice(interestPage * interestRowsPerPage, interestPage * interestRowsPerPage + interestRowsPerPage).map((row) => {

                        const { categoryVO, memberVO, id } = row;

                        return (
                          <TableRow
                            hover
                            key={id}
                            tabIndex={-1}
                            role="checkbox"
                          >
                            <TableCell align="center">{categoryVO.categoryId}</TableCell>
                            <TableCell align="left">{categoryVO.categoryName}</TableCell>
                            <TableCell >
                              <Button onClick={()=>confirmDeletePopup(id, categoryVO.categoryId, categoryVO.categoryName)}>해제</Button>
                            </TableCell>

                          </TableRow>
                        );
                      })}
                    </TableBody>

                  </Table>
                </TableContainer>

                <TablePagination
                  rowsPerPageOptions={[5, 10]}
                  component="div"
                  count={INTERESTCATEGORYLIST.length}
                  rowsPerPage={interestRowsPerPage}
                  page={interestPage}
                  onPageChange={handleChangeInterestPage}
                  onRowsPerPageChange={handleChangeInterestRowsPerPage}
                />
              </Scrollbar>
            </Item>


            <Item style={{width:'49%'}}>
              <Typography variant="h4" gutterBottom>
                강의 분류
              </Typography>

              <CategoryListToolbar filterValue={filterValue} onFilterValue={handleFilterByValue} />

              <Scrollbar>
                <TableContainer width="60%" margin="auto">
                  <Table>
                    <colgroup>
                      <col width="20%" />
                      <col width="50%" />
                      <col width="30%" />
                    </colgroup>

                    <CategoryListHead
                      order={order}
                      orderBy={orderBy}
                      rowCount={CATEGORYLIST.length}
                      headLabel={CATEGORY_TABLE_HEAD}
                      onRequestSort={handleRequestSort}
                    />

                    <TableBody>
                      {filteredCategories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                        const { categoryId, categoryName } = row;

                        return (
                          <TableRow
                            hover
                            key={categoryId}
                            tabIndex={-1}
                          >
                            <TableCell align="center">{categoryId}</TableCell>
                            <TableCell align="left">{categoryName}</TableCell>
                            <TableCell >
                              <Button onClick={()=>confirmAddPopup(categoryId, categoryName)}>관심분류 추가</Button>
                            </TableCell>

                          </TableRow>
                        );
                      })}
                    </TableBody>

                  </Table>
                </TableContainer>

                <TablePagination
                  rowsPerPageOptions={[5, 10]}
                  component="div"
                  count={CATEGORYLIST.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Scrollbar>

            </Item>

        </Stack>
      </Container>
    </Page>
  );
}