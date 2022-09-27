import { useRef, useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert'
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton } from '@mui/material';
// components
import MenuPopover from '../../components/MenuPopover';
// mocks_
import account from '../../_mock/account';
import axiosApi from '../../sections/axiosApi';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Home',
    icon: 'eva:home-fill',
    linkTo: '/',
  },
  {
    label: 'Settings',
    icon: 'eva:settings-2-fill',
    linkTo: '#',
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(null);
  const navigate = useNavigate();
  const http = axiosApi("members");

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const logOut = () => {
    localStorage.removeItem("user");
    // navigate('/login', { replace: true })
    window.location.replace('/login');
  };

  const logIn = () => {
    // navigate('/login', { replace: true })
    window.location.replace('/login');
  };

  const confirmPopup = () => {
    handleClose();
    confirmAlert({
      title : '회원탈퇴 확인',
      message : '회원탈퇴를 계속 하시겠습니까?',
      buttons: [
        {
          label: '네',
          onClick: () => {
            leave();
          }
        },
        {
          label: '아니오',
        }
      ]
    })
  }

  const alertPopup = (inputMessage) => {

    confirmAlert({
      title : '확인',
      message : inputMessage,
      buttons: [
        {
          label: '확인',
          onClick: () => window.location.replace('/login'),

        }
      ]
    })
  }

  const alertError = (inputMessage) => {
    confirmAlert({
      title : '탈퇴 오류',
      message : inputMessage,
      buttons: [
        {
          label: '확인',
        }
      ]
    })
  }

  const leave = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    http({
      method: 'delete',
      url: user.id,
    })
    .then(res =>
      alertPopup('정상적으로 탈퇴되었습니다.'),
    )
    .catch(err => alertError(err.response.data))

  };

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src={account.photoURL} alt="photoURL" />
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          p: 0,
          mt: 1.5,
          ml: 0.75,
          '& .MuiMenuItem-root': {
            typography: 'body2',
            borderRadius: 0.75,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {account.displayName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {account.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} to={option.linkTo} component={RouterLink} onClick={handleClose}>
              {option.label}
            </MenuItem>
          ))}


        <MenuItem onClick={confirmPopup} sx={{ m: 0 }} >
        회원탈퇴
        </MenuItem>
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {account.email && (
        <MenuItem onClick={logOut} sx={{ m: 1 }}>
          Logout
        </MenuItem>
        )}

        {!account.email && (
        <MenuItem onClick={logIn} sx={{ m: 1 }}>
          Login
        </MenuItem>
        )}



      </MenuPopover>
    </>
  );
}
