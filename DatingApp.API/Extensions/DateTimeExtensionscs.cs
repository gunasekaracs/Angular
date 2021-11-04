using System;

namespace API.Extensions
{
    public static class DateTimeExtensionscs
    {
        public static int CalcuateAge(this DateTime dob)
        {
            var today = DateTime.Today;
            var age = today.Year - dob.Year;
            if (dob.Date > today.AddYears(-age)) age--;
            return age;
        }
    }
}
