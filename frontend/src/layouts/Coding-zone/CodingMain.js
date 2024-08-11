import React, { useState, useEffect } from 'react';
import '../css/codingzone/codingzone-main.css';
import { useCookies } from "react-cookie";
import CzCard from '../../components/czCard';  
import { getAttendanceCount, deleteCodingZoneClass, reserveCodingZoneClass, getcodingzoneListRequest } from '../../apis/Codingzone-api.js'; 
import { useNavigate } from 'react-router-dom';

const ClassList = ({ classList, handleCardClick, handleToggleReservation }) => {
  return (
    <div className='cz-card'>
      {classList.map((classItem) => (
        <CzCard
          key={classItem.classNum}
          assistantName={classItem.assistantName}
          classTime={classItem.classTime}
          className={classItem.className}
          weekDay={classItem.weekDay}
          classDate={classItem.classDate}
          currentNumber={classItem.currentNumber}
          maximumNumber={classItem.maximumNumber}
          category={`[${classItem.grade}학년]`}
          onClick={() => handleCardClick(classItem)}
          onReserveClick={() => handleToggleReservation(classItem)}
          isReserved={classItem.isReserved} 
        />
      ))}
    </div>
  );
};

const CodingMain = () => {
  const [classList, setClassList] = useState([]);
  const [token, setToken] = useState('');  
  const [grade, setGrade] = useState(1);  
  const [weekDay, setWeekDay] = useState('');  
  const [cookies] = useCookies('accessToken');
  const [originalClassList, setOriginalClassList] = useState([]); 
  const [attendanceCount, setAttendanceCount] = useState(0); 
  const navigate = useNavigate();
  const [selectedZone, setSelectedZone] = useState(1);

  useEffect(() => {
    if (window.location.pathname.includes("coding-zone")) {
      const dFlexPElements = document.querySelectorAll('.d-flex p');
      dFlexPElements.forEach(element => {
        element.style.flexBasis = '150px'; 
      });
    }
  }, []);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const timeToNumber = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;  // 시간을 분으로 변환
  };

  const sortClassList = (classList) => {
    return classList.sort((a, b) => {
      const dayComparison = daysOfWeek.indexOf(a.weekDay) - daysOfWeek.indexOf(b.weekDay);
      if (dayComparison !== 0) {
        return dayComparison;
      }
      return timeToNumber(a.classTime) - timeToNumber(b.classTime);
    });
  };

  const filterByDay = (day) => {
    const filteredData = originalClassList.filter(classItem => {
        return classItem.weekDay.toLowerCase() === day.toLowerCase();
    });
    setClassList(filteredData);
    return filteredData;   
};

  useEffect(() => {
    const fetchData = async () => {
      const token = cookies.accessToken;
      try {
        const classes = await getcodingzoneListRequest(token, grade, weekDay);

        if (classes && classes.length > 0) {
          const updatedClasses = classes.map(classItem => ({
            ...classItem,
            isReserved: false  
          }));

          const sortedClasses = sortClassList(updatedClasses);  
          setOriginalClassList(sortedClasses); 
          setClassList(sortedClasses);
        } else {
          setOriginalClassList([]);
          setClassList([]);
        }
      } catch (error) {  
        setOriginalClassList([]);
        setClassList([]);
      }
    };
    fetchData();
  }, [token, grade, weekDay]);

  useEffect(() => {
    const fetchAttendance = async () => {
      const token = cookies.accessToken;
      if (token) {
        try {
          const count = await getAttendanceCount(token, grade);
          setAttendanceCount(count);
        } catch (error) {
          console.error("Failed to fetch attendance count:", error);
        }
      }
    };
    fetchAttendance();
  }, [token, grade]);

  const handleCardClick = (classItem) => {
    console.log('');
  };

  const handleToggleReservation = async (classItem) => {
    const token = cookies.accessToken;
    if (!token) {
      alert("You are not logged in.");
      return;
    }
    if (classItem.isReserved) {
      const result = await deleteCodingZoneClass(token, classItem.classNum);
      if (result) {
        alert("예약 취소가 완료되었습니다.");
        updateClassItem(classItem.classNum, false);  
      }
    } else {
      const result = await reserveCodingZoneClass(token, classItem.classNum);
      if (result) {
        alert("예약이 완료되었습니다.");
        updateClassItem(classItem.classNum, true);  
      }
    }
  };

  const handlecodingzone = () => {
    
    navigate(`/coding-zone`);
    
  };

  const handlecodingzoneattendence = () => {
    navigate(`/coding-zone/Codingzone_Attendence`);
  };


  const updateClassItem = (classNum, isReserved) => {
    const updatedList = classList.map(item =>
      item.classNum === classNum ? { ...item, isReserved } : item
    );
    setClassList(updatedList);
  };

  return (
    <div className="codingzone-container">
      <div className='select-container'>
        <span> | </span>
        <button onClick={handlecodingzone}>코딩존 예약</button>
        <span> | </span>
        <button onClick={handlecodingzoneattendence}>출결 관리</button>
        <span> | </span>
        <button>문의 하기</button>
        <span> | </span>
      </div>
      <div className="codingzone-top-container">
        <img src="/coding-zone-main.png" className="codingzonetop2-image"/>
      </div>
      <div className='codingzone-body-container'>
        <div className= "cz-category-top">
          <div className="cz-category-date">
            <button 
              className={`cz-1 ${selectedZone === 1 ? 'selected' : ''}`} 
              onClick={() => {
                setGrade(1);
                setSelectedZone(1);
              }}>
              Coding Zone1
            </button>
            <button 
              className={`cz-2 ${selectedZone === 2 ? 'selected' : ''}`} 
              onClick={() => {
                setGrade(2);
                setSelectedZone(2);
              }}>
              Coding Zone2
            </button>
          </div>
          <div className='cz-count-container'>
            출석횟수 : {attendanceCount}/6
          </div>
        </div>
        
        <div className="codingzone-date">
          <button onClick={() => filterByDay('Monday')}>Mon</button>
          <span> | </span>
          <button onClick={() => filterByDay('tuesday')}>Tue</button>
          <span> | </span>
          <button onClick={() => filterByDay('wednesday')}>Wed</button>
          <span> | </span>
          <button onClick={() => filterByDay('thursday')}>Thu</button>
          <span> | </span>
          <button onClick={() =>filterByDay('friday')}>Fri</button>
        </div>
        
        <div className='category-name-container'>
          <div className="separator"></div> 
          <div className="codingzone-title">
            <p className='weekDay'>요일</p> 
            <p className='weekDate'>날짜</p>
            <p className='weekTime'>시간</p>
            <p className='card-hidden-space'></p>
            <p className='weeksubject'>과목명</p>
            <p className='weekperson'>조교</p>
            <p className='weekcount'>인원</p>
            <p className='registerbutton'></p>
          </div>
          <div className="separator"></div>   
        </div>
        
        <div className="codingzone-list">
          <ClassList classList={classList} handleCardClick={handleCardClick} handleToggleReservation={handleToggleReservation} />
        </div>
      </div>
    </div>
  );
};

export default CodingMain;
