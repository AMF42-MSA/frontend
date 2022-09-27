import PropTypes from 'prop-types';
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { confirmAlert } from 'react-confirm-alert'

// material
import {
  Box,
  Radio,
  Stack,
  Button,
  Drawer,
  Rating,
  Divider,
  Link,
  Checkbox,
  FormGroup,
  IconButton,
  Typography,
  RadioGroup,
  FormControlLabel,
  InputAdornment,
} from '@mui/material';
import * as Yup from 'yup';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/Iconify';
import Scrollbar from '../../../components/Scrollbar';
import { ColorManyPicker } from '../../../components/color-utils';
import { FormProvider, RHFTextField, RHFCheckbox } from '../../../components/hook-form';
import axiosApi from '../../axiosApi';

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

UserInputBox.propTypes = {
  isOpenRegister: PropTypes.bool,
  onOpenRegister: PropTypes.func,
  onCloseRegister: PropTypes.func,
};


export default function UserInputBox({ isOpenRegister, onOpenRegister, onCloseRegister, onAfterSaveAuction, selectedLectinfo, selectedlectId}) {

  const inputName = "";
  const inputEmail = "";
  const inputPassword = "";
  const [showPassword, setShowPassword, setModalVisible] = useState(false);
  const navigate = useNavigate();

  const http = axiosApi();

  const LoginSchema = Yup.object().shape({
    inputName: Yup.string().required('Name is required'),
    inputEmail: Yup.string().email('Email must be a valid email address').required('Email is required'),
    inputPassword: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    inputName: '',
    inputEmail: '',
    inputPassword: '',
    remember: true,
  };

  const closeModal = () => {
    setModalVisible(false)
  }

  // 경매등록 확인창
  const confirmPopup = () => {
    onCloseRegister(); // 드로우를 닫는다.
    console.log(selectedlectId);
    console.log(selectedLectinfo);
    confirmAlert({
      title : '경매등록 확인',
      message : '경매등록을 계속 하시겠습니까?',
      buttons: [
        {
          label: '네',
          onClick: () => {
            auctionRegister();
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


  const alertError = (inputMessage) => {
    confirmAlert({
      title : '관리자 등록 오류',
      message : inputMessage,
      buttons: [
        {
          label: '확인',
        }
      ]
    })
  }


  const auctionRegister = () => {
    console.log(selectedLectinfo);
    http({
      method: 'put',
      url: '/singup',
      data: {
        lectId: selectedlectId[0],
      }
    })
    .then(res => alertPopup('사용자 등록확인'))
    .catch(err => alertError(err.response.data))
  }

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;


  const onSubmit = async () => {

    http({
      method: 'post',
      url: '/signup',
      data: {
        name: methods.getValues().inputName,
        email: methods.getValues().inputEmail,
        pwd: methods.getValues().inputPassword,
        memberType: 'ROLE_ADMIN',
      }
    })
    .then(res =>
      alertPopup('관리자 등록확인'),
      onCloseRegister(),
    )
    .catch(err => alertError(err.response.data))

  };

  return (
    <>

      {/* <Button disableRipple color="inherit" endIcon={<Iconify icon="ic:round-filter-list" />} onClick={onOpenFilter}>
        Filters&nbsp;
      </Button> */}
      <Button variant="contained" onClick={onOpenRegister} component={RouterLink} to="#" startIcon={<Iconify icon="eva:plus-fill" />}>
            관리자등록
      </Button>

      <Drawer
        anchor="right"
        open={isOpenRegister}
        onClose={onCloseRegister}
        PaperProps={{
          sx: { width: 480, border: 'none', overflow: 'hidden' },
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1, py: 2 }}>
          <Typography variant="subtitle1" sx={{ ml: 1 }}>
            관리자정보 입력
          </Typography>
          <IconButton onClick={onCloseRegister}>
            <Iconify icon="eva:close-fill" width={20} height={20} />
          </IconButton>
        </Stack>

        <Divider />

        <Scrollbar>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} sx={{ p: 3 }}>
        <RHFTextField name="inputName" label="이름" />
        <RHFTextField name="inputEmail" label="Email address" />
        <RHFTextField
          name="inputPassword"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 3 }}>
        <RHFCheckbox name="remember" label="Remember me" />
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 3 }}>
        <LoadingButton size="large" type="submit" variant="contained" loading={isSubmitting}>
          등록하기
        </LoadingButton>
      </Stack>
    </FormProvider>
        </Scrollbar>

        <Box sx={{ p: 3 }}>
          <Button
            fullWidth
            size="large"
            type="submit"
            color="inherit"
            variant="outlined"
            startIcon={<Iconify icon="ic:round-clear-all" />}
          >
            Clear All
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
