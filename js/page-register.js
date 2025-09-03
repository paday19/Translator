// 密码显示/隐藏切换
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');
const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
const confirmPasswordInput = document.getElementById('confirmPassword');

function setupPasswordToggle(toggleBtn, inputField) {
    toggleBtn.addEventListener('click', () => {
        const type = inputField.getAttribute('type') === 'password' ? 'text' : 'password';
        inputField.setAttribute('type', type);
        
        // 切换图标
        const icon = toggleBtn.querySelector('i');
        if (type === 'text') {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        } else {
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        }
    });
}

setupPasswordToggle(togglePassword, passwordInput);
setupPasswordToggle(toggleConfirmPassword, confirmPasswordInput);

// 验证码发送
const sendCodeBtn = document.getElementById('sendCodeBtn');
sendCodeBtn.addEventListener('click', () => {
    const email = document.getElementById('email').value.trim();
    
    if (!validateEmail(email)) {
        document.getElementById('emailError').style.display = 'block';
        return;
    }
    
    // 模拟发送验证码
    sendCodeBtn.disabled = true;
    sendCodeBtn.innerHTML = '发送中...';
    let countdown = 60;
    
    setTimeout(() => {
        const timer = setInterval(() => {
            sendCodeBtn.innerHTML = `重新发送(${countdown})`;
            countdown--;
            if (countdown < 0) {
                clearInterval(timer);
                sendCodeBtn.innerHTML = '发送验证码';
                sendCodeBtn.disabled = false;
            }
        }, 1000);
        
        // 显示成功提示
        const codeError = document.getElementById('codeError');
        codeError.textContent = '验证码已发送到您的邮箱';
        codeError.style.color = '#10b981';
        codeError.style.display = 'block';
        
        setTimeout(() => {
            codeError.textContent = '验证码错误';
            codeError.style.color = '#ef4444';
            codeError.style.display = 'none';
        }, 3000);
    }, 1000);
});

// 表单提交处理
const registerForm = document.getElementById('registerForm');
const registerBtn = document.getElementById('registerBtn');

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // 用户名验证
    const username = document.getElementById('username').value.trim();
    if (username === '') {
        document.getElementById('usernameError').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('usernameError').style.display = 'none';
    }

    // 邮箱验证
    const email = document.getElementById('email').value.trim();
    if (!validateEmail(email)) {
        document.getElementById('emailError').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('emailError').style.display = 'none';
    }

    // 密码验证
    const password = passwordInput.value.trim();
    if (password.length < 8) {
        document.getElementById('passwordError').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('passwordError').style.display = 'none';
    }

    // 确认密码验证
    const confirmPassword = confirmPasswordInput.value.trim();
    if (confirmPassword !== password) {
        document.getElementById('confirmError').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('confirmError').style.display = 'none';
    }

    // 验证码验证
    const verificationCode = document.getElementById('verificationCode').value.trim();
    if (verificationCode === '') {
        document.getElementById('codeError').textContent = '请输入验证码';
        document.getElementById('codeError').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('codeError').style.display = 'none';
    }

    // 如果验证通过，模拟注册过程
    if (isValid) {
        // 显示加载状态
        registerBtn.disabled = true;
        registerBtn.innerHTML = '<span class="loading-spinner"></span> 注册中...';

        // 模拟注册请求
        setTimeout(() => {
            // 注册成功提示
            alert('注册成功！即将跳转到登录页面');
            
            // 重置按钮状态
            registerBtn.disabled = false;
            registerBtn.innerHTML = '注册';
            
            // 实际项目中此处跳转到登录页面
            window.location.href="page-login.html";
            // window.location.href = '/login';
        }, 1500);
    }
});

// 邮箱验证函数
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// 输入框聚焦时隐藏错误提示
const inputs = document.querySelectorAll('.form-input');
inputs.forEach(input => {
    input.addEventListener('focus', () => {
        const errorEl = input.parentElement.nextElementSibling;
        if (errorEl && errorEl.classList.contains('error-message')) {
            errorEl.style.display = 'none';
        }
    });
});