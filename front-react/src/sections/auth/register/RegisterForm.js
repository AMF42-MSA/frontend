import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { confirmAlert } from 'react-confirm-alert'
// @mui
import { Stack, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import axiosApi from '../../axiosApi';
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';

// ----------------------------------------------------------------------

export default function RegisterForm({ onAfterSaveAuction}) {
  const http = axiosApi();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const RegisterSchema = Yup.object().shape({
    inputName: Yup.string().required('Name required'),
    inputEmail: Yup.string().email('Email must be a valid email address').required('Email is required'),
    inputPassword: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    inputName: '',
    inputEmail: '',
    inputPassword: '',
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const alertPopup = (inputMessage) => {
    confirmAlert({
      title : '사용자 등록확인',
      message : inputMessage,
      buttons: [
        {
          label: '확인',
          onClick: () => navigate('/login', { replace: true })
//          onClick: () => onAfterSaveAuction()

        }
      ]
    })
  }

  const alertError = (inputMessage) => {
    confirmAlert({
      title : '사용자 등록 오류',
      message : inputMessage,
      buttons: [
        {
          label: '확인',
        }
      ]
    })
  }

  const onSubmit = async () => {
    http({
      method: 'post',
      url: '/signup',
      data: {
        name: methods.getValues().inputName,
        email: methods.getValues().inputEmail,
        pwd: methods.getValues().inputPassword,
      }
    })
    .then(res => alertPopup('확인을 누르면 로그인 페이지로 이동합니다.'))
    .catch(err => alertError(err.response.data))
  }
  ;

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="inputName" label="Name" />
        </Stack>

        <RHFTextField name="inputEmail" label="Email address" />

        <RHFTextField
          name="inputPassword"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" onClick={() => setShowPassword(!showPassword)}>
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
          Signup
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
