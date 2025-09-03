// 修改后的page-login.js
// 密码显示/隐藏切换
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

togglePassword.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    // 切换图标
    const icon = togglePassword.querySelector('i');
    if (type === 'text') {
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    } else {
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    }
});



// 表单提交处理
const loginForm = document.getElementById('loginForm');
const loginBtn = document.getElementById('loginBtn');
const emailInput = document.getElementById('email');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');

// FastAPI base URL
const API_URL = "https://3fbe9a9d6d60.ngrok-free.app/";

// 通用请求函数
async function makeRequest(url, options = {}) {
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error("请求失败:", error);
        throw error;
    }
}

function getCookie(name)
{
    const cookies=document.cookie.split(';');
    for(index in cookies)
    {
        let c=cookies[index];
        while(c.charAt(0)===' ')c=c.substring(1,c.length);
        if(c.indexOf(name+'=')===0)return c.substring(name.length+1,c.length);
    }
}
function setCookie(name,value,days)
{
    let expires="";
    if(days)
    {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie=name+'='+(value || "")+expires+"; path=/";
}
async function requestToken(mail)
{
    try{
        let data=await makeRequest(`${API_URL}/token`,{
            method:"POST",
            body:JSON.stringify({mail:mail})
        });
        return data;
    }catch(error)
    {
        console.warn("Failed to get token from server, automatic password filling may not work.");
        console.error("Failed to request token:",error);
    }
}

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    let isValid = true;

    // 邮箱验证
    const email = emailInput.value.trim();
    if (!validateEmail(email)) {
        emailError.style.display = 'block';
        isValid = false;
    } else {
        emailError.style.display = 'none';
    }

    // 密码验证
    const password = passwordInput.value.trim();
    if (password === '') {
        passwordError.style.display = 'block';
        isValid = false;
    } else {
        passwordError.style.display = 'none';
    }

    // 如果验证通过，发送登录请求
    if (isValid) {
        // 显示加载状态
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<span class="loading-spinner"></span> 登录中...';

        try {
            // 发送登录请求到FastAPI后端
            const data = await makeRequest(`${API_URL}/login`, {
                method: "POST",
                body: JSON.stringify({ email, password })
            });

            // 登录成功
            alert('登录成功！即将跳转到首页');
            
            // 检查"记住我"选项
            const rememberMe = document.getElementById('rememberMe').checked;
            if (rememberMe) {
                // 保存邮箱到localStorage
                localStorage.setItem('savedEmail', email);
                // 保存token到localStorage
                localStorage.setItem('authToken', data.access_token);
            } else {
                localStorage.removeItem('savedEmail');
                localStorage.removeItem('authToken');
            }

            // 跳转到首页
            window.location.href = "page-translate.html";
            
        } catch (error) {
            // 登录失败
            alert('登录失败: ' + error.message);
            
            // 重置按钮状态
            loginBtn.disabled = false;
            loginBtn.innerHTML = '登录';
        }
    }
});

// 邮箱验证函数
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// 页面加载时检查是否有保存的邮箱
window.addEventListener('load', async() => {
    const savedEmail = localStorage.getItem('savedEmail');
    if (savedEmail) {
        emailInput.value = savedEmail;
        document.getElementById('rememberMe').checked = true;
        let token=getCookie("authToken");
        let saved_password=await savedPassword(savedEmail,token);
        if(saved_password)
        {
            passwordInput.value=saved_password;
        }
    }
});

// 输入框聚焦时隐藏错误提示
[emailInput, passwordInput].forEach(input => {
    input.addEventListener('focus', () => {
        if (input === emailInput) {
            emailError.style.display = 'none';
        } else {
            passwordError.style.display = 'none';
        }
    });

});
