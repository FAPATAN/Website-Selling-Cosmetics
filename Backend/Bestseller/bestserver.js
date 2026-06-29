const bestRouter = require('./Routes/bestrouter');
app.use('/api', bestRouter); // เปลี่ยนจาก bestrouter เป็น bestRouter (R ตัวใหญ่)

app.get('/', (req, res) => {
    res.send('Backend Server is running successfully!');
});