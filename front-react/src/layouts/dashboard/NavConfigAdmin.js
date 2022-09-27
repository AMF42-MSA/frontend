// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: '강의분류',
    path: '/admin/lecturecategory',
    icon: getIcon('ant-design:tag-filled'),
  },
  {
    title: '사용자관리',
    path: '/admin/member',
    icon: getIcon('eva:people-fill'),
  },
  {
    title: '로그인',
    path: '/login',
    icon: getIcon('eva:lock-fill'),
  },
];
export default navConfig;
