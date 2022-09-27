import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { confirmAlert } from 'react-confirm-alert'
// @mui
import { Link, Stack, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import axiosApi from '../../axiosApi';
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField, RHFCheckbox } from '../../../components/hook-form';


// ----------------------------------------------------------------------

export default function LoginForm() {

  const http = axiosApi();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    inputEmail: Yup.string().email('Email must be a valid email address').required('Email is required'),
    inputPassword: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    inputEmail: '',
    inputPassword: '',
    remember: true,
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
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
      title : '로그인 오류',
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
      url: '/login',
      data: {
        email: methods.getValues().inputEmail,
        pwd: methods.getValues().inputPassword,
      }
    })
    .then(response => {
      // const { accessToken } = response.data.token;
      // API 요청하는 콜마다 헤더에 accessToken 담아 보내도록 설정
      // http.defaults.headers.Authorization = `Bearer ${accessToken}`;
      // setHeaders(response.data.token);

      if (response.data.token) {
        console.log("response.data.token===>",response.data.token)
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      window.location.replace('/');
      // navigate('/', { replace: true });
      return response.data;

    })
    .catch(err => alertError('로그인 정보를 확인후 재시도 해주세요.'))

  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
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

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <RHFCheckbox name="remember" label="Remember me" />
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
        Login
      </LoadingButton>
    </FormProvider>
  );
}
