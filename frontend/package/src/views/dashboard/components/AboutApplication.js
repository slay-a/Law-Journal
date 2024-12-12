import React from "react";
import { Grid, Box, Typography, Paper } from "@mui/material";
import PageContainer from "src/components/container/PageContainer";

// Import Images
import im1 from "src/assets/images/im/im1.png";
import im2 from "src/assets/images/im/im2.png";
import im3 from "src/assets/images/im/im3.png";
import im4 from "src/assets/images/im/im4.png";

// Custom components
const AboutApplication = () => {
  return (
    <Paper elevation={3} sx={{ padding: 4, borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
      <Box 
        sx={{
          position: 'absolute',
          top: '-30px',
          left: '-30px',
          width: '150px',
          height: '150px',
          backgroundColor: 'primary.main',
          borderRadius: '50%',
          opacity: 0.15,
        }} 
      />
      <Typography
        variant="h1"
        fontWeight="900"
        sx={{
          fontSize: "3rem",
          textAlign: "center",
          textTransform: "uppercase",
          color: "primary.main",
          letterSpacing: 3,
          mb: 3,
          fontFamily: "'Jersey M54', sans-serif",
        }}
      >
        Sugar Bear's Law Journal
      </Typography>
      <Typography 
        variant="body1" 
        fontSize="1.1rem" 
        sx={{ lineHeight: 1.8, position: 'relative', zIndex: 2 }}
      >
        Hi Sugar Bear! Welcome to your personal Law Journal. Here, you can log, review, and track your LSAT practice entries. 
        Use the tools provided to add new entries, edit existing ones, or delete entries that you no longer need. 
        This application is built to make your learning journey smooth, organized, and effective.
      </Typography>
    </Paper>
  );
};

const FeatureSection = ({ title, description, image, reverse = false }) => {
  return (
    <Grid 
      container 
      spacing={0} 
      sx={{ mt: 10, alignItems: 'center', flexDirection: reverse ? 'row-reverse' : 'row' }}
    >
      <Grid item xs={12} md={6}>
        <img
          src={image}
          alt={title}
          style={{
            width: "80%",
            height: "auto",
            borderRadius: "20px",
            objectFit: "cover",
            boxShadow: '0px 10px 30px rgba(0,0,0,0.1)',
            marginLeft: '50px',
            paddingLeft: '0px',
          }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Box 
          sx={{
            position: 'relative',
            paddingLeft: '80px',
          }}
        >
          <Box 
            sx={{
              position: 'absolute',
              top: '-50px',
              left: '-70px',
              width: '100px',
              height: '100px',
              backgroundColor: 'secondary.light',
              borderRadius: '50%',
              opacity: 0.15,
              zIndex: -1,
            }} 
          />
          <Typography 
            variant="h4" 
            fontWeight="700" 
            sx={{
              mb: 2, 
              background: 'linear-gradient(90deg, #ff8c00, #ff0080)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent'
            }}
          >
            {title}
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              lineHeight: 1.8, 
              position: 'relative',
              zIndex: 2 
            }}
          >
            {description}
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

const Dashboard = () => {
  return (
    <PageContainer title="Sugar Bear's Law Journal" description="This is Sugar Bear's Law Journal">
      <Box>
        <Grid container spacing={3}>
          {/* About Section */}
          <Grid item xs={12}>
            <AboutApplication />
          </Grid>

        </Grid>

        {/* Footer Section */}
        <Box 
          sx={{ 
            mt: 8, 
            textAlign: 'center', 
            pb: 4, 
            position: 'relative', 
            overflow: 'hidden' 
          }}
        >
          <Box 
            sx={{
              position: 'absolute',
              top: '-50px',
              left: '-50px',
              width: '180px',
              height: '180px',
              backgroundColor: 'primary.light',
              borderRadius: '50%',
              opacity: 0.1,
            }} 
          />
          <Box 
            sx={{
              position: 'absolute',
              bottom: '-40px',
              right: '-40px',
              width: '150px',
              height: '150px',
              backgroundColor: 'secondary.light',
              borderRadius: '50%',
              opacity: 0.15,
            }} 
          />
          <Typography
            variant="body2"
            fontSize="0.9rem"
            color="text.secondary"
            sx={{ fontWeight: 400, fontStyle: 'italic' }}
          >
            Created by slay-a
          </Typography>
        </Box>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
// import React from "react";
// import { Grid, Box, Typography, Paper } from "@mui/material";
// import PageContainer from "src/components/container/PageContainer";

// // Import Images
// import im1 from "src/assets/images/im/im1.png";
// import im2 from "src/assets/images/im/im2.png";
// import im3 from "src/assets/images/im/im3.png";
// import im4 from "src/assets/images/im/im4.png";

// // Custom components
// const AboutApplication = () => {
//   return (
//     <Paper elevation={3} sx={{ padding: 4, borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
//       <Box 
//         sx={{
//           position: 'absolute',
//           top: '-30px',
//           left: '-30px',
//           width: '150px',
//           height: '150px',
//           backgroundColor: 'primary.main',
//           borderRadius: '50%',
//           opacity: 0.15,
//         }} 
//       />
//       <Typography
//         variant="h1"
//         fontWeight="900"
//         sx={{
//           fontSize: "3rem",
//           textAlign: "center",
//           textTransform: "uppercase",
//           color: "primary.main",
//           letterSpacing: 3,
//           mb: 3,
//           fontFamily: "'Jersey M54', sans-serif",
//         }}
//       >
//         About Our Application
//       </Typography>
//       <Typography variant="body1" fontSize="1.1rem" sx={{ lineHeight: 1.8, position: 'relative', zIndex: 2 }}>
//         Our application provides a platform to enhance creativity and make content creation seamless. From text styling to generating stunning visuals, we empower users to bring their ideas to life. Our tools are designed to support users of all kinds — students, professionals, and hobbyists alike.
//       </Typography>
//     </Paper>
//   );
// };

// const FeatureSection = ({ title, description, image, reverse = false }) => {
//   return (
//     <Grid 
//       container 
//       spacing={0} 
//       sx={{ mt: 10, alignItems: 'center', flexDirection: reverse ? 'row-reverse' : 'row' }}
//     >
//       <Grid item xs={12} md={6}>
//         <img
//           src={image}
//           alt={title}
//           style={{
//             width: "80%",
//             height: "auto",
//             borderRadius: "20px",
//             objectFit: "cover",
//             boxShadow: '0px 10px 30px rgba(0,0,0,0.1)',
//             marginLeft: '50px', // Proper usage of margin-left
//             paddingLeft:'0px',
//           }}
//         />
//       </Grid>
//       <Grid item xs={12} md={6}>
//         <Box 
//           sx={{
//             position: 'relative',
//             paddingLeft:'80px',
//             // paddingRight: reverse ? '20px' : 0,
//           }}
//         >
//           <Box 
//             sx={{
//               position: 'absolute',
//               top: '-50px',
//               left: '-70px',
//               // right: reverse ? '-50px' : 'auto',
//               width: '100px',
//               height: '100px',
//               backgroundColor: 'secondary.light',
//               borderRadius: '50%',
//               opacity: 0.15,
//               zIndex: -1,
//             }} 
//           />
//           <Typography 
//             variant="h4" 
//             fontWeight="700" 
//             sx={{
//               mb: 2, 
//               background: 'linear-gradient(90deg, #ff8c00, #ff0080)', 
//               WebkitBackgroundClip: 'text', 
//               WebkitTextFillColor: 'transparent'
//             }}
//           >
//             {title}
//           </Typography>
//           <Typography 
//             variant="body1" 
//             sx={{ 
//               lineHeight: 1.8, 
//               position: 'relative',
//               zIndex: 2 
//             }}
//           >
//             {description}
//           </Typography>
//         </Box>
//       </Grid>
//     </Grid>
//   );
// };

// const Dashboard = () => {
//   return (
//     <PageContainer title="Dashboard" description="This is the Dashboard">
//       <Box>
//         <Grid container spacing={3}>
//           {/* About Section */}
//           <Grid item xs={12}>
//             <AboutApplication />
//           </Grid>

//           {/* Feature Sections */}
//           <FeatureSection 
//             title="Paraphrasing Tool" 
//             description="Our Paraphrasing Tool allows you to rephrase and rewrite text in seconds. Ideal for students, professionals, and content creators, it provides fresh, creative alternatives to your content. With intelligent suggestions, you can enhance clarity, avoid plagiarism, and create better versions of your original content." 
//             image={im1} 
//           />

//           <FeatureSection 
//             title="PDF Quiz Generator" 
//             description="Instantly turn your PDF documents into interactive quizzes. Our quiz generator reads PDF files and creates tailored questions to test knowledge, making it the perfect tool for teachers, students, and trainers. Upload your file, and let the system do the work for you." 
//             image={im2} 
//             reverse 
//           />

//           <FeatureSection 
//             title="Custom Designs" 
//             description="Create personalized and unique designs with our easy-to-use design editor. Customization is simple — drag, drop, and modify design elements as you wish. Add text, images, and effects to build visual content that stands out." 
//             image={im3} 
//           />

//           <FeatureSection 
//             title="Easy Editing Tools" 
//             description="Our editing tools provide you with everything you need to fine-tune your creations. Adjust fonts, colors, sizes, and layouts effortlessly. Our user-friendly interface ensures that even non-designers can achieve professional results." 
//             image={im4} 
//             reverse 
//           />
//         </Grid>

//         {/* Footer Section */}
//         <Box 
//           sx={{ 
//             mt: 8, 
//             textAlign: 'center', 
//             pb: 4, 
//             position: 'relative', 
//             overflow: 'hidden' 
//           }}
//         >
//           <Box 
//             sx={{
//               position: 'absolute',
//               top: '-50px',
//               left: '-50px',
//               width: '180px',
//               height: '180px',
//               backgroundColor: 'primary.light',
//               borderRadius: '50%',
//               opacity: 0.1,
//             }} 
//           />
//           <Box 
//             sx={{
//               position: 'absolute',
//               bottom: '-40px',
//               right: '-40px',
//               width: '150px',
//               height: '150px',
//               backgroundColor: 'secondary.light',
//               borderRadius: '50%',
//               opacity: 0.15,
//             }} 
//           />
//           <Typography
//             variant="body2"
//             fontSize="0.9rem"
//             color="text.secondary"
//             sx={{ fontWeight: 400, fontStyle: 'italic' }}
//           >
//             Created by slay-a
//           </Typography>
//         </Box>
//       </Box>
//     </PageContainer>
//   );
// };

// export default Dashboard;