import styled from 'styled-components';

export const Container = styled.div`
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	padding: 10px;
	background-color: black;
	color: cyan;
	font-size: 40px;
`;

export const Table = styled.table`
	th {
		text-align: left;
	}
	td,
	th {
		padding: 5px 20px;
	}
`;
