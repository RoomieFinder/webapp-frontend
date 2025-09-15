'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';

export default function Home() {
  const [filterValue, setFilterValue] = useState('');

  const handleFilter = (event: SelectChangeEvent) => {
    setFilterValue(event.target.value);
  };

  const [view, setView] = useState<string | null>('Popular');

  const handleView = (
    event: React.MouseEvent<HTMLElement>,
    newView: string | null,
  ) => {
      setView(newView);
  };


  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        bgcolor: '#1D2D44',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Sticky Search Bar */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          bgcolor: 'white',
          p: 2,
          borderRadius: 1,
          m: 2,
        }}
      >
        <Stack direction="row" spacing={5} alignItems="center">
          <TextField label="Search" variant="filled" sx={{ width: '50%' }} />
          <FormControl sx={{ width: '25%' }}>
            <InputLabel>Filter</InputLabel>
            <Select value={filterValue} onChange={handleFilter}>
              <MenuItem value="Bangkok">Bangkok</MenuItem>
              <MenuItem value="Thonburi">Thonburi</MenuItem>
              <MenuItem value="Ayutthaya">Ayutthaya</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ flexGrow: 1 }} />
          <AccountCircleIcon sx={{ fontSize: 50 }} />
        </Stack>
      </Box>

      {/* Scrollable Content Area */}
      <Box sx={{ flex: 1, display: 'flex', overflowY: 'auto', p: 2, gap: 2 }}>
        {/* Left Column */}
        <Box sx={{ flex: 1, overflowY: 'auto',scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' }}}>
          <Stack direction="column" spacing={2}>
            <Box
              sx={{
                bgcolor: 'white',
                width: '100%',
                height: 250,
                borderRadius: 2,
                p: 2,
                pb: 5

              }}
            >
              <Typography variant='h6' sx={{ mb: 1 }}>Recommended Places</Typography>
              <ImageList
                sx={{
                  flexWrap: 'nowrap',
                  overflowX: 'auto',
                  overflowY: 'hidden',
                  transform: 'translateZ(0)', // smoother scrolling
                  height: '90%',
                  scrollbarWidth: 'none', // Firefox
                  '&::-webkit-scrollbar': { display: 'none' }, // Chrome, Safari
                }}
                cols={itemData.length} // allow scrolling instead of wrapping
                rowHeight= {170}
              > 
                {itemData.map((item) => (
                  <ImageListItem key={item.img} sx={{ minWidth: 250 }}>
                    <img
                      src={`${item.img}?w=248&fit=crop&auto=format`}
                      alt={item.title}
                      loading="lazy"
                      style={{ height: '80%', objectFit: 'cover', borderRadius: 8 }}
                    />
                    <ImageListItemBar
                      title={item.title}
                      sx={{
                        background:
                          'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                      }}
                      actionIcon={
                        <IconButton sx={{ color: 'white' }}>
                          <StarBorderIcon />
                        </IconButton>
                      }
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </Box>
 
            <Box sx={{ bgcolor: 'white', width: '100%', height: "100%", borderRadius: 2 }}>
              <Stack direction="column" spacing={2} p={2}>
                 <ToggleButtonGroup
                    value={view}
                    exclusive
                    onChange={handleView}
                    aria-label="view selection"
                  >
                    <ToggleButton value="popular" aria-label="popular">
                      <Typography>Popular</Typography>
                    </ToggleButton>
                    <ToggleButton value="latest" aria-label="latest">
                      <Typography>Latest</Typography>
                    </ToggleButton>
                  </ToggleButtonGroup>
                <Box sx={{width: '100%', height: 300, borderRadius: 2, border: 1.5, borderColor:'#1D2D44', padding:2}}>
                  <img 
                    src="https://img.freepik.com/free-photo/pretty-smiling-joyfully-female-with-fair-hair-dressed-casually-looking-with-satisfaction_176420-15187.jpg?semt=ais_hybrid&w=740&q=80" 
                    alt="pfp" 
                    style={{width: '90px', height: '90px', objectFit: 'cover', borderRadius: "100%"}}
                  />
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Box>

        {/* Right Sticky Panel */}
        <Box
          sx={{
            bgcolor: 'white',
            width: '30%',
            height: '81vh',
            borderRadius: 2,
            position: 'sticky',
            top: 20,
            alignSelf: 'flex-start',
          }}
        />
      </Box>
    </Box>
  );
}

const itemData = [
  {
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
    title: 'Lasaelle Apartment',
  },
  {
    img: 'https://images.unsplash.com/photo-1501183638710-841dd1904471', // fixed
    title: 'Supalai Place',
  },
  {
    img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914',
    title: 'Ideo Mobi Sukhumvit',
  },
  {
    img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
    title: 'The Line Asoke-Ratchada',
  },
  {
    img: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb', // fixed
    title: 'Rhythm Ekkamai',
  },
  {
    img: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde', // fixed
    title: 'Q Chidlom–Phetchaburi',
  },
  {
    img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
    title: 'Park 24 Condo',
  },
  {
    img: 'https://images.unsplash.com/photo-1527030280862-64139fba04ca',
    title: 'Ideo Q Siam–Ratchathewi',
  },
  {
    img: 'https://images.unsplash.com/photo-1554995207-c18c203602cb',
    title: 'Noble Ploenchit',
  },
  {
    img: 'https://images.unsplash.com/photo-1599427303058-f04cbcf4756f', // fixed
    title: 'Ashton Asoke',
  },
];




