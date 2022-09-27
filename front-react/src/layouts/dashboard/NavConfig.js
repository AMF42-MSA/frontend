// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  // {
  //   title: 'dashboard',
  //   path: '/dashboard/app',
  //   icon: getIcon('eva:pie-chart-2-fill'),
  // },
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
];

export default navConfig;
