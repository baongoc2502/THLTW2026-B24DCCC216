import component from "@/locales/en-US/component";
import route from "mock/route";
import path from "path";

export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/RandomNumber',
		name: ' Game Đoán số',
		component: './RandomNumber',
		icon: 'aim',
	},

	{
		path: '/Study-Manager',
		name: 'Quản lý học tập',
		component: './StudyManager',
		icon: 'BookOutlined',
	},
	{
		path: '/oan-tu-ti',
		name: 'Oẳn Tù Tì',
		component: './OanTuTi',
		icon: 'ScissorOutlined',
	},
	{
		path: '/question-management',
		name: 'Quản lý câu hỏi',
		component: './QuestionManagament',
		icon: 'QuestionOutlined',
	},
	{
		path:  '/product',
		name:  'Quản lý sản phẩm',
		icon:  'ShopOutlined',
		component: './ProductManagement',
	},
	{
		path: '/dat-lich',
		name: 'Đặt lịch hẹn',
		component: './DatLich',
		icon: 'CalendarOutlined',
	},
	{
		path: '/diploma-management',
		name: 'Quản lý văn bằng',
		component: './diploma/DiplomaManagement',
		icon: 'FileDoneOutlined',	
	},
	{
		path: '/Clb',
		name: 'Quản lý CLB',
		component: './Clb',
		icon: 'TeamOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/travel-planner',
		name: 'Lập kế hoạch du lịch',
		icon: 'compass',
		component: './TravelPlanner',
	},
	{
		path: '/course-manager',
		name: 'Quản lý khóa học',
		component: './Course/CourseManager',
		icon: 'BookOutlined',
	},
	
	{
	path: '/blog',
	name: 'Blog',
	icon: 'ReadOutlined',
	routes: [
		{ path: '/blog', redirect: '/blog/list' },
		{ 
			path: '/blog/list', 
			name: 'Danh sách bài viết', 
			component: '@/pages/Blog/index',
		},
		{ 
			path: '/blog/post/:slug', 
			component: '@/pages/Blog/Detail',
			hideInMenu: true,
		},
		{ 
			path: '/blog/admin', 
			name: 'Quản lý bài viết', 
			component: '@/pages/Blog/Admin',
		},
		{ 
			path: '/blog/tags', 
			name: 'Quản lý thẻ', 
			component: '@/pages/Blog/components/TagManager',  // ✅ SỬA ĐƯỜNG DẪN
		},
		{ 
			path: '/blog/about', 
			name: 'Giới thiệu', 
			component: '@/pages/Blog/About',
		},
	]
},
	//{
	//	path: '/blog/tags',
	//	name: 'Quản lý thẻ',
	//	component: '@/pages/Blog/TagManager',
	//	icon: 'TagOutlined',
	//},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},
	{
		path: '/todo-list',
		name: 'TodoList',
		icon: 'OrderedListOutlined',
		component: './TodoList',
	},

	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
