// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: '강의등록',
    path: '/dashboard/products',
    icon: getIcon('eva:shopping-bag-fill'),
  },
  {
    title: '수강신청',
    path: '/dashboard/lectureregister',
    icon: getIcon('eva:shopping-bag-fill'),
  },
  {
    title: '강의경매',
    path: '/dashboard/auction',
    icon: getIcon('ic:baseline-gavel'),
  },
  {
    title: '경매입찰',
    path: '/dashboard/auctionBid',
    icon: getIcon('ic:baseline-monetization-on'),
  },
  {
    title: '관심분류',
    path: '/dashboard/interestcategory',
    icon: getIcon('bi:bookmark-star-fill'),
  },
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
